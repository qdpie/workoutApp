from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.exercise_model import ExerciseInstance, Exercise
from app.actions.exercise_instance_service import ExerciseInstanceService
from app.schemas.exercise_instance_schema import ExerciseInstanceOut, ExerciseInstanceUpdate, ExerciseInstanceCreate
from app.models.session_model import Session
from app.models.user_model import User
from app.actions.user_service import UserService
from app.actions.session_service import SessionService
from app.actions.exercise_service import ExerciseService

exercise_instance_router = APIRouter()

@exercise_instance_router.get('/exercise-instances/exercise/{exercise_id}',operation_id="getExerciseInstancesByExercise", summary="Get all exercise instances by exercise", response_model=List[ExerciseInstanceOut])
async def get_exercise_instances_by_exercise(exercise_id: UUID, user: User = Depends(UserService.get_current_user)) -> List[ExerciseInstance]:
    exercise = await ExerciseService.get_exercise(user=user, exercise_id=exercise_id)
    return await ExerciseInstanceService.list_exercise_instances_by_exercise(exercise=exercise, user=user)

@exercise_instance_router.get('/exercise-instances/{session_id}',operation_id="getExerciseInstances", summary="Get all exercise instances", response_model=List[ExerciseInstanceOut])
async def get_exercise_instances(session: Session = Depends(SessionService.get_current_session), user: User = Depends(UserService.get_current_user)) -> List[ExerciseInstance]:
    return await ExerciseInstanceService.list_exercise_instances(session=session, user=user)

@exercise_instance_router.post('/{session_id}',operation_id="createExerciseInstance", summary="Create an exercise instance", response_model=ExerciseInstance)
async def create_exercise_instance(data: ExerciseInstanceCreate, session: Session = Depends(SessionService.get_current_session), user: User = Depends(UserService.get_current_user)) -> ExerciseInstance:
    return await ExerciseInstanceService.create_exercise_instance(data=data, user=user, session=session)

@exercise_instance_router.get('/{exercise_instance_id}',operation_id="getExerciseInstance", summary="Get a single exercise instance", response_model=ExerciseInstanceOut)
async def get_exercise_instance(exercise_instance_id: UUID, user: User = Depends(UserService.get_current_user)) -> ExerciseInstanceOut:
    return await ExerciseInstanceService.get_exercise_instance(user=user, exercise_instance_id=exercise_instance_id)

@exercise_instance_router.put('/{exercise_instance_id}',operation_id="updateExerciseInstance", summary="Update an exercise instance", response_model=ExerciseInstanceOut)
async def update_exercise_instance(exercise_instance_id: UUID, data: ExerciseInstanceUpdate, user: User = Depends(UserService.get_current_user)) -> ExerciseInstanceOut:
    return await ExerciseInstanceService.update_exercise_instance(user=user, exercise_instance_id=exercise_instance_id, data=data)

@exercise_instance_router.delete('/{exercise_instance_id}',operation_id="deleteExerciseInstance", summary="Delete an exercise instance")
async def delete_exercise_instance(exercise_instance_id: UUID, user: User = Depends(UserService.get_current_user)) -> None:
    return await ExerciseInstanceService.delete_exercise_instance(user=user, exercise_instance_id=exercise_instance_id)