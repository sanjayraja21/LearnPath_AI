
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..ai import ask_ollama
from ..database import get_session
from ..models import AssistantResult

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])


class AssistantRequest(BaseModel):
    question: str = Field(min_length=1, max_length=10000)


@router.post("/")
async def assistant_chat(
    request: AssistantRequest,
    session: Session = Depends(get_session),
):
    answer = await ask_ollama(request.question)

    result = AssistantResult(
        user_input=request.question,
        generated_result=answer,
    )
    session.add(result)
    session.commit()
    session.refresh(result)

    return {
        "id": result.id,
        "question": request.question,
        "answer": answer,
        "response": answer,
    }
