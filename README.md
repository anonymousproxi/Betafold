# BetaFold

Protein structure analysis web app. Submit an amino-acid sequence and get back a 3D structure, secondary-structure breakdown, mutation analysis and an AI assistant that answers questions about your protein.

## Features

- **Sequence analysis**: matches against RCSB PDB (≥90% identity), with DSSP secondary structure and a PyTorch transformer heuristic fallback
- **3D viewer**: interactive Mol* structure viewer
- **Mutation analysis**: inspect the effect of residue substitutions
- **AI chat**: Gemini-powered assistant with the job's structural context
- **Async jobs**: Celery + Redis workers with email notification on completion (Resend)
- **Auth**: JWT signup/login, per-user job history

## Architecture

```
Next.js (3000) ──► FastAPI (8000) ──► PostgreSQL
                        │
                        └─► Redis ──► Celery workers (analysis, email)
```

| Layer | Stack |
|-------|-------|
| Frontend | Next.js 16, React 19, Tailwind 4, Mol* |
| API | FastAPI, SQLAlchemy, gunicorn + uvicorn workers |
| Workers | Celery, Redis |
| Storage | PostgreSQL (SQLite for local dev) |

## Quick start (Docker)

```bash
cp .env.example .env      # set SECRET_KEY, and optionally GEMINI_API_KEY / RESEND_API_KEY
docker compose up --build
```

Open http://localhost:3000. API docs at http://localhost:8000/docs.

## Local development

```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload                                  # uses SQLite by default
celery -A worker.celery_app worker --loglevel=info        # needs Redis on localhost:6379

# frontend
cd frontend
npm install
npm run dev
```

## Scaling

- Stateless API: run more replicas behind a load balancer; `gunicorn -w` controls workers per container
- Heavy analysis runs in Celery: `docker compose up --scale worker=N`
- Set `DATABASE_URL` to Postgres (pooled, `pool_pre_ping`); `jobs.user_id` is indexed
- All URLs and secrets are environment-driven (see `.env.example`)

## Configuration

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | JWT signing key (required in production) |
| `DATABASE_URL` | SQLAlchemy URL |
| `REDIS_URL` | Celery broker/backend |
| `GEMINI_API_KEY` | Enables the AI assistant (otherwise simulation mode) |
| `RESEND_API_KEY` | Enables completion emails (otherwise logged) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `FRONTEND_URL` | Link used in emails |
| `NEXT_PUBLIC_API_URL` | API base URL baked into the frontend build |
