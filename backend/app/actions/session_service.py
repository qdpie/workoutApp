import pymongo.errors as err
from typing import List
from uuid import UUID
from app.models.session_model import Session
from app.schemas.session_schema import SessionCreate, SessionUpdate, SessionOut, SessionWorkoutOut
from app.models.user_model import User
from app.models.workout_model import Workout

class SessionService:
    @staticmethod
    async def get_current_session(session_id: UUID) -> Session:
        session = await Session.find_one(Session.session_id == session_id)
        if not session:
            raise err.OperationFailure(code=404, details="Session not found")
        return session

    @staticmethod
    async def get_active_sessions(user: User) -> List[SessionOut]:
        return await Session.find(Session.owner.user_id == user.user_id, Session.active == True, fetch_links=True).to_list()

    @staticmethod
    async def get_workout_sessions(workout: Workout, user: User) -> List[SessionWorkoutOut]:
        return await Session.find(Session.owner.user_id == user.user_id, Session.workout.workout_id == workout.workout_id, fetch_links=True).to_list()

    @staticmethod
    async def list_sessions(user: User) -> List[SessionOut]:
        return await Session.find(Session.owner.user_id == user.user_id, fetch_links=True).to_list()

    @staticmethod
    async def create_session(user: User, workout: Workout, data: SessionCreate) -> SessionOut:
        session = Session(**data.model_dump(), owner=user, workout=workout)
        return await session.insert()

    @staticmethod
    async def get_session(user: User, session_id: UUID) -> SessionOut:
        session = await Session.find_one(Session.session_id == session_id, Session.owner.user_id == user.user_id, fetch_links=True)
        if not session:
            raise err.OperationFailure("Session not found")
        return session

    @staticmethod
    async def update_session(user: User, session_id: UUID, data: SessionUpdate) -> SessionOut:
        session = await Session.find_one(Session.session_id == session_id, Session.owner.user_id == user.user_id, fetch_links=True)
        if not session:
            raise err.OperationFailure("Session not found")
        await session.update({"$set": data.model_dump(exclude_unset=True)})
        await session.save()
        return session

    @staticmethod
    async def delete_session(user: User, session_id: UUID) -> None:
        session = await Session.find_one(Session.session_id == session_id, Session.owner.user_id == user.user_id, fetch_links=True)
        if not session:
            raise err.OperationFailure("Session not found")
        await session.delete()
        return None
