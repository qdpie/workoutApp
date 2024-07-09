from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.actions.user_service import UserService
from app.schemas.workout_schema import WorkoutCreate, WorkoutUpdate, WorkoutOut
from app.actions.workout_service import WorkoutService
from app.models.workout_model import Workout

workout_router = APIRouter()

@workout_router.get('/',operation_id="getWorkouts", summary="Get all workouts", response_model=List[WorkoutOut])
async def get_workouts(user: User = Depends(UserService.get_current_user)) -> List[Workout]:
    return await WorkoutService.list_workouts(user=user)

@workout_router.post('/',operation_id="createWorkout", summary="Create a workout", response_model=Workout)
async def create_workout(data: WorkoutCreate, user: User = Depends(UserService.get_current_user)) -> Workout:
    return await WorkoutService.create_workout(user=user, data=data)

@workout_router.get('/{workout_id}',operation_id="getWorkout", summary="Get a single workout", response_model=WorkoutOut)
async def get_workout(workout_id: UUID, user: User = Depends(UserService.get_current_user)) -> WorkoutOut:
    return await WorkoutService.get_workout(current_user=user, workout_id=workout_id)

@workout_router.put('/{workout_id}',operation_id="updateWorkout", summary="Update a workout", response_model=WorkoutOut)
async def update_workout(workout_id: UUID, data: WorkoutUpdate, user: User = Depends(UserService.get_current_user)) -> WorkoutUpdate:
    return await WorkoutService.update_workout(current_user=user, workout_id=workout_id, data=data)

@workout_router.delete('/{workout_id}',operation_id="deleteWorkout", summary="Delete a workout")
async def delete_workout(workout_id: UUID, user: User = Depends(UserService.get_current_user)) -> None:
    return await WorkoutService.delete_workout(current_user=user, workout_id=workout_id)