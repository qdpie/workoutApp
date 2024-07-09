from pydantic import BaseModel, Field
from typing import List
from uuid import UUID
from app.models.exercise_model import ExerciseInstance
from app.models.workout_model import Workout
from datetime import datetime

class SessionCreate(BaseModel):
    date: datetime
    active: bool
class SessionUpdate(BaseModel):
    duration_mins: int | None
    active: bool
class SessionOut(BaseModel):
    session_id: UUID
    date: datetime
    duration_mins: int | None
    active: bool
    workout: Workout
class SessionWorkoutOut(BaseModel):
    session_id: UUID
    date: datetime
    duration_mins: int | None
    active: bool