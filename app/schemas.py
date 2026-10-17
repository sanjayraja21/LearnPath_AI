
from typing import Optional

from sqlmodel import SQLModel, Field


class RoadmapCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    category: str = "General"
    status: str = "Not Started"
    progress: int = Field(default=0, ge=0, le=100)
    target_date: Optional[str] = None


class RoadmapUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)
    target_date: Optional[str] = None
