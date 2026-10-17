
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..ai import ask_ollama
from ..database import get_session
from ..models import SkillGapResult

router = APIRouter(prefix="/api/skill-gap", tags=["Skill Gap"])


class SkillGapRequest(BaseModel):
    current_skills: str = Field(min_length=1, max_length=2000)
    target_skill: str = Field(min_length=1, max_length=300)


@router.post("/")
async def analyze_skill_gap(
    request: SkillGapRequest,
    session: Session = Depends(get_session),
):
    prompt = (
        f"The learner currently knows: {request.current_skills}. "
        f"Their target skill is: {request.target_skill}. "
        "Identify missing skills, explain the gaps in simple language, "
        "and provide a step-by-step learning roadmap with practice tasks."
    )

    answer = await ask_ollama(prompt)

    result = SkillGapResult(
        current_skills=request.current_skills,
        target_skill=request.target_skill,
        generated_result=answer,
    )
    session.add(result)
    session.commit()
    session.refresh(result)

    return {
        "id": result.id,
        "current_skills": request.current_skills,
        "target_skill": request.target_skill,
        "analysis": answer,
        "answer": answer,
    }
