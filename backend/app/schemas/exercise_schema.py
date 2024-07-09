from pydantic import BaseModel
from app.types import Muscle, ExerciseType, Gender
from typing import List
from uuid import UUID

class ExerciseCreate(BaseModel):
    name: str
    type: ExerciseType
    muscle: str
    equipment: str
    description: str

class ExerciseUpdate(BaseModel):
    name: str | None
    type: ExerciseType | None
    muscle: str | None
    equipment: str | None
    description: str | None
    track_reps: bool | None
    track_weight: bool | None
    track_distance: bool | None
    track_duration: bool | None

class ExerciseOut(BaseModel):
    exercise_id: UUID
    name: str
    type: ExerciseType | None
    muscle: str | None
    equipment: str | None
    description: str | None
    track_reps: bool
    track_weight: bool
    track_distance: bool
    track_duration: bool

class ExerciseGPTData(BaseModel):
    workout_name: str
    age: int
    gender: Gender
    weight: int
    height: int
    goal: str
    experience: str
    time: str
    target_muscle: List[str]
    equipment: List[str]
    exercise_type: List[str]

class ExerciseGPTOut(BaseModel):
    workout_name: str
    notes: str
    exercises: List[ExerciseCreate]