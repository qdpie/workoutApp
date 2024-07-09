from pydantic import BaseModel, Field
from typing import List
from uuid import UUID
from app.models.exercise_model import Exercise
from datetime import datetime

class WorkoutCreate(BaseModel):
    title: str = Field(..., title='Title', max_length=50, min_length=1)
    day_of_week: List[int] = []
    # duration_mins: int | None #maybe add here

class WorkoutUpdate(BaseModel):
    title: str | None = Field(..., title='Title', max_length=50, min_length=1)
    duration_mins: int | None
    day_of_week: List[int] = []

class WorkoutOut(BaseModel):
    workout_id: UUID
    title: str
    created_date: datetime
    duration_mins: int | None
    day_of_week: List[int] = []
