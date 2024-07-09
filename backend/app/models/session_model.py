from beanie import Document, Link
from pydantic import Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import List

from app.models.workout_model import Workout
from app.models.user_model import User

class Session(Document):
    session_id: UUID = Field(default_factory=uuid4, unique=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    duration_mins: int | None = Field(default=None)
    active: bool = Field(default=False)
    workout: Link[Workout]
    owner: Link[User]

    def __repr__(self) -> str:
        return f"<Session: {self.session_id}>"

    def __str__(self) -> str:
        return self.session_id

    def __hash__(self) -> int:
        return hash(self.session_id)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Workout):
            return self.session_id == other.session_id
        return False

    class Settings:
        name = "sessions"