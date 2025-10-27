from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db, session_scope
from .auth import create_initial_admin
from .routers import auth, employees, tasks, shifts, assignments, reports


app = FastAPI(title="Wavepark Shift Manager", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(tasks.router)
app.include_router(shifts.router)
app.include_router(assignments.router)
app.include_router(reports.router)


@app.on_event("startup")
def on_startup():
    init_db()
    with session_scope() as session:
        create_initial_admin(session)


@app.get("/")
def read_root():
    return {"status": "ok"}
