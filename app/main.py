from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlmodel import Session, select
from .ai import ask_ollama
from .database import create_db_and_tables, get_session
from .models import RoadmapItem
from .schemas import RoadmapCreate, RoadmapUpdate
from .routers import assistant, quiz, skill_gap, study_planner
from .models import AssistantResult

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="LearnPath AI",
    description="AI-powered personalized learning platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register feature routers
app.include_router(assistant.router)
app.include_router(quiz.router)
app.include_router(skill_gap.router)
app.include_router(study_planner.router)


class AIChatRequest(BaseModel):
    message: Optional[str] = Field(default=None, max_length=10000)
    question: Optional[str] = Field(default=None, max_length=10000)
    prompt: Optional[str] = Field(default=None, max_length=10000)


@app.get("/")
def home():
    return {
        "message": "Welcome to LearnPath AI",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


# Compatibility endpoint for the existing frontend
@app.post("/api/ai/chat")
async def ai_chat(
    request: AIChatRequest,
    session: Session = Depends(get_session),
):
    user_message = (
        request.message or request.question or request.prompt or ""
    ).strip()

    if not user_message:
        raise HTTPException(
            status_code=422,
            detail="Please enter a message.",
        )

    answer = await ask_ollama(user_message)

    result = AssistantResult(
        user_input=user_message,
        generated_result=answer,
    )

    session.add(result)
    session.commit()
    session.refresh(result)

    return {
        "id": result.id,
        "question": user_message,
        "response": answer,
        "answer": answer,
        "saved": True,
    }


@app.get("/api/roadmap")
def get_roadmap(session: Session = Depends(get_session)):
    statement = select(RoadmapItem).order_by(RoadmapItem.id.desc())
    return session.exec(statement).all()


@app.post("/api/roadmap", status_code=201)
def create_roadmap_item(
    item: RoadmapCreate,
    session: Session = Depends(get_session),
):
    db_item = RoadmapItem(**item.model_dump())
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item


@app.get("/api/roadmap/{item_id}")
def get_roadmap_item(
    item_id: int,
    session: Session = Depends(get_session),
):
    item = session.get(RoadmapItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")
    return item


@app.put("/api/roadmap/{item_id}")
def update_roadmap_item(
    item_id: int,
    updates: RoadmapUpdate,
    session: Session = Depends(get_session),
):
    item = session.get(RoadmapItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@app.delete("/api/roadmap/{item_id}")
def delete_roadmap_item(
    item_id: int,
    session: Session = Depends(get_session),
):
    item = session.get(RoadmapItem, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    session.delete(item)
    session.commit()
    return {"message": "Roadmap item deleted", "id": item_id}


@app.get("/api/dashboard")
def dashboard(session: Session = Depends(get_session)):
    roadmap_items = session.exec(select(RoadmapItem)).all()

    total = len(roadmap_items)
    completed = sum(
        1 for item in roadmap_items
        if item.status.lower() == "completed" or item.progress == 100
    )
    average_progress = (
        round(sum(item.progress for item in roadmap_items) / total)
        if total else 0
    )

    return {
        "total_roadmap_items": total,
        "completed_items": completed,
        "average_progress": average_progress,
    }
