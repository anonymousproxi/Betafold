import os
import json
import sys
from celery import Celery
from dotenv import load_dotenv
import resend

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import SessionLocal, ProteinJob, User
from predictor import analyze_sequence

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

def send_completion_email(user_email: str, job_id: str, protein_name: str):
    if not RESEND_API_KEY:
        print(f"📧 [EMAIL MOCK] To: {user_email} | Subject: BetaFold Analysis Complete - {protein_name}")
        return
    try:
        resend.Emails.send({
            "from": "BetaFold <onboarding@resend.dev>",
            "to": [user_email],
            "subject": f"BetaFold Analysis Complete: {protein_name}",
            "html": f"<p>Your automated protein analysis for job <strong>{job_id}</strong> is complete!</p><p>Result matched: {protein_name}</p><p><a href='http://localhost:3000/results/{job_id}'>Click here to view your 3D structure and AI insights.</a></p>"
        })
    except Exception as e:
        print(f"Failed to send email: {e}")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "betafold_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="run_analysis")
def run_analysis(job_id: str, sequence: str):
    
    db = SessionLocal()
    try:
        job = db.query(ProteinJob).filter(ProteinJob.job_id == job_id).first()
        if job:
            job.status = "processing"
            db.commit()
            
        result = analyze_sequence(sequence)
        
        if job:
            job.status = "completed"
            job.analysis = json.dumps(result)
            db.commit()
            
            # Send Notification
            user = db.query(User).filter(User.id == job.user_id).first()
            if user:
                protein_name = result.get("metadata", {}).get("Protein Name", "Unknown Protein")
                send_completion_email(user.email, job.job_id, protein_name)
                
    except Exception as e:
        print(f"Analysis failed for {job_id}: {e}")
        db.rollback()
        job = db.query(ProteinJob).filter(ProteinJob.job_id == job_id).first()
        if job:
            job.status = "failed"
            db.commit()
    finally:
        db.close()
