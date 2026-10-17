
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..ai import ask_ollama
from ..database import get_session
from ..models import StudyPlanResult

router = APIRouter(prefix="/api/study-planner", tags=["Study Planner"])


class StudyPlanRequest(BaseModel):
    learning_goal: str = Field(min_length=1, max_length=1000)
    available_time: str = Field(min_length=1, max_length=200)


@router.post("/")
async def generate_study_plan(
    request: StudyPlanRequest,
    session: Session = Depends(get_session),
):
    prompt = (
        f"Create a practical study plan for this learning goal: "
        f"{request.learning_goal}. Available time: {request.available_time}. "
        "Organize the plan into days or weeks, include practice exercises, "
        "revision, and measurable milestones. Use simple language."
    )

    answer = await ask_ollama(prompt)

    result = StudyPlanResult(
        learning_goal=request.learning_goal,
        available_time=request.available_time,
        generated_result=answer,
    )
    session.add(result)
    session.commit()
    session.refresh(result)

    return {
        "id": result.id,
        "learning_goal": request.learning_goal,
        "available_time": request.available_time,
        "study_plan": answer,
        "answer": answer,
    }
