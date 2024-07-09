from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.session_model import Session
from app.actions.session_service import SessionService
from app.schemas.session_schema import SessionOut, SessionUpdate, SessionCreate, SessionWorkoutOut
from app.models.user_model import User
from app.models.workout_model import Workout
from app.actions.user_service import UserService
from app.actions.workout_service import WorkoutService

session_router = APIRouter()

@session_router.get('/',operation_id="getSessions", summary="Get all sessions", response_model=List[SessionOut])
async def get_sessions(user: User = Depends(UserService.get_current_user)) -> List[Session]:
    return await SessionService.list_sessions(user=user)

@session_router.post('/{workout_id}',operation_id="createSession", summary="Create an session", response_model=Session)
async def create_session(data: SessionCreate, user: User = Depends(UserService.get_current_user), workout: Workout = Depends(WorkoutService.get_current_workout)) -> Session:
    return await SessionService.create_session(user=user, workout=workout, data=data)

@session_router.get('/{session_id}',operation_id="getSession", summary="Get a single session", response_model=SessionOut)
async def get_session(session_id: UUID, user: User = Depends(UserService.get_current_user)) -> SessionOut:
    return await SessionService.get_session(session_id=session_id, user = user)

@session_router.put('/{session_id}',operation_id="updateSession", summary="Update an session", response_model=SessionOut)
async def update_session(session_id: UUID, data: SessionUpdate, user: User = Depends(UserService.get_current_user)) -> SessionOut:
    return await SessionService.update_session(session_id=session_id, data=data, user=user)

@session_router.delete('/{session_id}',operation_id="deleteSession", summary="Delete an session")
async def delete_session(session_id: UUID, user: User = Depends(UserService.get_current_user)) -> None:
    return await SessionService.delete_session(session_id=session_id, user=user)

@session_router.get('/active/sessions',operation_id="getActiveSessions", summary="Get all active sessions", response_model=List[SessionOut])
async def get_active_sessions(user: User = Depends(UserService.get_current_user)) -> List[Session]:
    return await SessionService.get_active_sessions(user=user)

@session_router.get('/workout/{workout_id}',operation_id="getWorkoutSessions", summary="Get all sessions for a workout", response_model=List[SessionWorkoutOut])
async def get_workout_sessions(workout_id: UUID, user: User = Depends(UserService.get_current_user)) -> List[Session]:
    workout = await WorkoutService.get_current_workout(workout_id=workout_id)
    return await SessionService.get_workout_sessions(workout=workout, user=user)