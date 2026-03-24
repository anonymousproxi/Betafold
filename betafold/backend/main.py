from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, init_db, User, ProteinJob
from auth import hash_password, verify_password, create_token, get_current_user
from predictor import analyze_sequence
from worker import run_analysis
import uuid, json
from datetime import datetime
import os
import google.generativeai as genai

app = FastAPI(title="BetaFold API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup():
    init_db()

# ─── Auth ─────────────────────────────────────────────────────────────────────
class SignupRequest(BaseModel):
    name: str; email: str; password: str

class LoginRequest(BaseModel):
    email: str; password: str

@app.post("/auth/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(id=str(uuid.uuid4()), name=req.name, email=req.email, password_hash=hash_password(req.password))
    db.add(user); db.commit()
    return {"message": "Account created"}

@app.post("/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user.id, "email": user.email})
    return {"access_token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}

# ─── Jobs ─────────────────────────────────────────────────────────────────────
class SubmitRequest(BaseModel):
    sequence: str

@app.post("/jobs/submit")
def submit_job(req: SubmitRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    clean = req.sequence.upper().strip()
    valid = set('ACDEFGHIKLMNPQRSTVWY')
    if not all(c in valid for c in clean):
        raise HTTPException(status_code=400, detail="Invalid amino acid characters")
    job = ProteinJob(job_id=str(uuid.uuid4()), user_id=current_user["sub"], sequence=clean, status="pending")
    db.add(job); db.commit()
    run_analysis.delay(job.job_id, clean)
    return {"job_id": job.job_id}

@app.get("/jobs")
def list_jobs(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    jobs = db.query(ProteinJob).filter(ProteinJob.user_id == current_user["sub"]).order_by(ProteinJob.created_at.desc()).all()
    return [{"job_id": j.job_id, "sequence": j.sequence, "status": j.status, "created_at": j.created_at.isoformat(), "analysis": j.analysis} for j in jobs]

@app.get("/jobs/{job_id}")
def get_job(job_id: str, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.query(ProteinJob).filter(ProteinJob.job_id == job_id, ProteinJob.user_id == current_user["sub"]).first()
    if not job: raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id": job.job_id, "sequence": job.sequence, "status": job.status,
        "created_at": job.created_at.isoformat(),
        "analysis": json.loads(job.analysis) if job.analysis else None
    }

# ─── AI Chat ──────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    messages: list
    context: dict

@app.post("/chat")
def chat_with_ai(req: ChatRequest, current_user=Depends(get_current_user)):
    """Provides conversational AI insights based on the protein structural job context."""
    job_context = json.dumps(req.context) if req.context else "No structural context provided."
    # Assuming the user's question is the last message in the list, or the list contains a single message string.
    # If `req.messages` is intended to be a list of dicts like Anthropic's, this needs adjustment.
    # For now, taking the last message as the user's question.
    user_question = req.messages[-1] if req.messages else "No specific question provided."

    prompt = f"""
    You are BetaFold's AI Assistant, an expert computational biologist.
    The user is asking a question about a protein analysis job.
    Here is the full structural analysis metadata and ML heuristics for their protein:
    {job_context}
    
    User Question: {user_question}
    
    Answer the user's question clearly and concisely. Reference the structural metadata where relevant.
    """
    
    from dotenv import load_dotenv
    load_dotenv(override=True)
    
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            return {"reply": response.text}
        except Exception as e:
            return {"reply": f"Gemini API Error: {str(e)}"}
    else:
        return {
            "reply": "BetaFold AI is currently in simulation mode (No `GEMINI_API_KEY` provided). Keep in mind that a hydrophobic core usually dictates rapid folding! Add your Gemini API key to `.env` to enable live conversational intelligence."
        }

# Fix missing import
from database import SessionLocal