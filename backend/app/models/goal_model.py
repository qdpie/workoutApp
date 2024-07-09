from pydantic import Field
from beanie import Document, Indexed, Link
from uuid import UUID, uuid4
from datetime import datetime
from app.types import GoalType, TrackType

from .user_model import User

class Goal(Document):
    goal_id: UUID = Field(default_factory=uuid4, unique=True)
    category: GoalType
    goal: int
    track_type: TrackType | None = None
    exercise: str | None = None
    owner: Link[User]


    def __repr__(self) -> str:
        return f"<Goal: {self.goal}>"

    def __str__(self) -> str:
        return self.goal

    def __hash__(self) -> int:
        return hash(self.goal)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, Goal):
            return self.goal_id == other.goal_id
        return False

    class Settings:
        name = "goals"