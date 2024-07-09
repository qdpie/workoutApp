from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.exercise_model import Exercise
from app.actions.exercise_service import ExerciseService
from app.schemas.exercise_schema import ExerciseOut, ExerciseUpdate, ExerciseCreate
from app.models.workout_model import Workout
from app.models.user_model import User
from app.actions.user_service import UserService
from app.actions.workout_service import WorkoutService

exercise_router = APIRouter()

@exercise_router.get('/',operation_id="getAllExercises", summary="Get all exercises", response_model=List[ExerciseOut])
async def get_all_exercises(user: User = Depends(UserService.get_current_user)) -> List[Exercise]:
    return await ExerciseService.list_all_exercises(user=user)

@exercise_router.get('/exercises/{workout_id}',operation_id="getExercises", summary="Get all exercises", response_model=List[ExerciseOut])
async def get_exercises(workout: Workout = Depends(WorkoutService.get_current_workout), user: User = Depends(UserService.get_current_user)) -> List[Exercise]:
    return await ExerciseService.list_exercises(workout=workout, user=user)

@exercise_router.post('/{workout_id}',operation_id="createExercise", summary="Create an exercise", response_model=Exercise)
async def create_exercise(data: ExerciseCreate, workout: Workout = Depends(WorkoutService.get_current_workout), user: User = Depends(UserService.get_current_user)) -> Exercise:
    return await ExerciseService.create_exercise(data=data, workout=workout, user=user)

@exercise_router.get('/{exercise_id}',operation_id="getExercise", summary="Get a single exercise", response_model=ExerciseOut)
async def get_exercise(exercise_id: UUID, user: User = Depends(UserService.get_current_user)) -> ExerciseOut:
    return await ExerciseService.get_exercise(exercise_id=exercise_id, user=user)

@exercise_router.put('/{exercise_id}',operation_id="updateExercise", summary="Update an exercise", response_model=ExerciseOut)
async def update_exercise(exercise_id: UUID, data: ExerciseUpdate, user: User = Depends(UserService.get_current_user)) -> ExerciseOut:
    return await ExerciseService.update_exercise(exercise_id=exercise_id, data=data, user=user)

@exercise_router.delete('/{exercise_id}',operation_id="deleteExercise", summary="Delete an exercise")
async def delete_exercise(exercise_id: UUID, user: User = Depends(UserService.get_current_user)) -> None:
    return await ExerciseService.delete_exercise(exercise_id=exercise_id, user=user)