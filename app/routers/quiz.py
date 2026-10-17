
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..ai import ask_ollama
from ..database import get_session
from ..models import QuizResult

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])


class QuizRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=300)
    number_of_questions: int = Field(default=5, ge=1, le=20)


@router.post("/")
async def generate_quiz(
    request: QuizRequest,
    session: Session = Depends(get_session),
):
    prompt = (
        f"Create {request.number_of_questions} multiple-choice quiz "
        f"questions about {request.topic}. Give four options per question, "
        "identify the correct answer, and briefly explain it. "
        "Number the questions clearly."
    )

    answer = await ask_ollama(prompt)

    result = QuizResult(
        topic=request.topic,
        generated_result=answer,
    )
    session.add(result)
    session.commit()
    session.refresh(result)

    return {
        "id": result.id,
        "topic": request.topic,
        "quiz": answer,
        "answer": answer,
    }
