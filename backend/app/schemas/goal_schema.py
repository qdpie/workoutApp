from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from app.types import GoalType, TrackType
from app.models.user_model import User
from app.schemas.user_schema import UserOut

class GoalCreate(BaseModel):
    category: GoalType 
    goal: int
    track_type: TrackType | None
    exercise: str | None

class GoalUpdate(BaseModel):
    category: GoalType | None
    goal: int | None
    exercise: str | None

class GoalOut(BaseModel):
    goal_id: UUID 
    category: GoalType 
    goal: int
    track_type: TrackType | None
    exercise: str | None
    owner: UserOut