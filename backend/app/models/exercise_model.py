from beanie import Document, Link
from pydantic import Field, BaseModel
from uuid import UUID, uuid4
from typing import List

from app.types import ExerciseType
from app.types import Muscle
from app.models.workout_model import Workout
from app.models.user_model import User
from app.models.session_model import Session

class Exercise(Document):
    exercise_id: UUID = Field(default_factory=uuid4, unique=True)
    name: str = Field(..., title='Name', max_length=50, min_length=1)
    type: ExerciseType | None = Field(default=None)
    equipment: str | None = Field(default=None)
    description: str | None = Field(default=None)
    muscle: str | None = Field(default=None)
    # track_sets: bool = Field(default=False)
    track_reps: bool = Field(default=False)
    track_weight: bool = Field(default=False)
    track_distance: bool = Field(default=False)
    track_duration: bool = Field(default=False)
    # track_calories: bool = Field(default=False)
    workout: Link[Workout]
    owner: Link[User]

    class Settings:
        name = "exercises"

class ExerciseInstance(Document):
    exercise_instance_id: UUID = Field(default_factory=uuid4, unique=True)
    sets: int = Field(default=1)
    reps: List[int] = Field(default=[])
    weight: List[float] = Field(default=[])
    distance: List[float] = Field(default=[])
    duration: List[str] = Field(default=[])
    exercise: Link[Exercise]
    session: Link[Session]
    owner: Link[User]

    class Settings:
        name = "exercise-instances"
