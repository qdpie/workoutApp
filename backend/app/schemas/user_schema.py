from pydantic import BaseModel, Field
from uuid import UUID

from app.types import Gender

class UserAuth(BaseModel):
    email: str = Field(..., description="user email")
    username: str = Field(..., min_length=5, max_length=50, description="user username")
    password: str = Field(..., min_length=5, max_length=50, description="user password")

class UserOut(BaseModel):
    user_id: UUID
    username: str
    email: str
    first_name: str | None
    last_name: str | None
    birth_date: str | None
    gender: Gender | None
    height_in: int | None
    weight: int | None

class UserUpdate(BaseModel):
    email: str | None
    first_name: str | None
    last_name: str | None
    birth_date: str | None
    gender: Gender | None
    height_in: int | None
    weight: int | None