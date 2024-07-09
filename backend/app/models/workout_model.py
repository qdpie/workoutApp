from pydantic import BaseModel, Field
from datetime import datetime
from typing import List
from beanie import Document, Indexed, Link
from uuid import UUID, uuid4

from .user_model import User

class Workout(Document):
    workout_id: UUID = Field(default_factory=uuid4, unique=True)
    title: Indexed(str)
    created_date: datetime = Field(default_factory=datetime.utcnow)
    duration_mins: int | None = None
    day_of_week: List[int] = []
    # calories_burned: int
    # exercises: List[str] | None = Field(default_factory=list)
    owner: Link[User]

    def __repr__(self) -> str:
        return f"<Workout: {self.title}>"

    def __str__(self) -> str:
        return self.title

    def __hash__(self) -> int:
        return hash(self.title)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Workout):
            return self.workout_id == other.workout_id
        return False

    class Settings:
        name = "workouts"