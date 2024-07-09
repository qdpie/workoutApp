from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import time
from app.models.exercise_model import Exercise
from app.models.session_model import Session
class ExerciseInstanceCreate(BaseModel):
    exercise_id: UUID
class ExerciseInstanceUpdate(BaseModel):
    sets: int
    reps: List[int]
    weight: List[float]
    distance: List[float]
    duration: List[str]

class ExerciseInstanceOut(BaseModel):
    exercise_instance_id: UUID
    sets: int
    reps: List[int]
    weight: List[float]
    distance: List[float]
    duration: List[str]
    exercise: Exercise
    session: Session