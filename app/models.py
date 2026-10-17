
from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field


def utc_now():
    return datetime.now(timezone.utc)


class RoadmapItem(SQLModel, table=True):
    __tablename__ = "roadmapitem"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = ""
    category: str = "General"
    status: str = "Not Started"
    progress: int = Field(default=0, ge=0, le=100)
    target_date: Optional[str] = None
    created_at: datetime = Field(default_factory=utc_now)


class AssistantResult(SQLModel, table=True):
    __tablename__ = "assistantresult"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_input: str
    generated_result: str
    created_at: datetime = Field(default_factory=utc_now)


class QuizResult(SQLModel, table=True):
    __tablename__ = "quizresult"

    id: Optional[int] = Field(default=None, primary_key=True)
    topic: str
    generated_result: str
    created_at: datetime = Field(default_factory=utc_now)


class SkillGapResult(SQLModel, table=True):
    __tablename__ = "skillgapresult"

    id: Optional[int] = Field(default=None, primary_key=True)
    current_skills: str
    target_skill: str
    generated_result: str
    created_at: datetime = Field(default_factory=utc_now)


class StudyPlanResult(SQLModel, table=True):
    __tablename__ = "studyplanresult"

    id: Optional[int] = Field(default=None, primary_key=True)
    learning_goal: str
    available_time: str
    generated_result: str
    created_at: datetime = Field(default_factory=utc_now)
