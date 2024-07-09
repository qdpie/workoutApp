from typing import Optional
from uuid import UUID
import pymongo.errors as err
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError

from app.schemas.user_schema import UserAuth, UserUpdate
from app.models.user_model import User
from app.schemas.auth_schema import TokenPayload

from .auth import get_hashed_password, verify_password
from config import settings

reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    scheme_name="JWT"
)

class UserService:
    @staticmethod
    async def create_user(user: UserAuth) -> User:
        user_in = User(
            username=user.username,
            email=user.email,
            hashed_password=get_hashed_password(user.password),
        )
        await user_in.insert()
        return user_in

    @staticmethod
    async def authenticate_user(email: str, password: str) -> User | None:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_password=user.hashed_password):
            return None

        return user

    @staticmethod
    async def get_user_by_email(email: str) -> User | None:
        user = await User.find_one(User.email == email)
        return user

    @staticmethod
    async def get_user_by_id(user_id: UUID) -> User | None:
        user = await User.find_one(User.user_id == user_id)
        return user

    @staticmethod
    async def update_user(user_id: UUID, data: UserUpdate) -> User:
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise err.OperationFailure("User not found")

        await user.update({"$set": data.model_dump(exclude_unset=True)})
        await user.save()
        return user

    @staticmethod
    async def delete_user(user_id: UUID) -> User:
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise err.OperationFailure("User not found")

        await user.delete()
        return None

    @staticmethod
    async def get_current_user(token: str = Depends(reuseable_oauth)) -> User:
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            token_data = TokenPayload(**payload)

            if datetime.fromtimestamp(token_data.exp) < datetime.now():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired",
                    headers={"WWW-Authenticate": "Bearer"}
                )
        except(jwt.JWTError, ValidationError):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )

        user = await UserService.get_user_by_id(token_data.sub)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return user