from typing import List
from uuid import UUID
import pymongo.errors as err
from app.models.user_model import User
from app.models.workout_model import Workout
from app.schemas.workout_schema import WorkoutCreate, WorkoutUpdate, WorkoutOut
from app.actions.exercise_service import ExerciseService

class WorkoutService:
    @staticmethod
    async def get_current_workout(workout_id: UUID) -> Workout:
        workout = await Workout.find_one(Workout.workout_id == workout_id)
        if not workout:
            raise err.OperationFailure(code=404, details="Workout not found")
        return workout

    @staticmethod
    async def list_workouts(user: User) -> List[WorkoutOut]:
        return await Workout.find(Workout.owner.user_id == user.user_id, fetch_links=True).to_list()

    @staticmethod
    async def create_workout(user: User, data: WorkoutCreate) -> Workout:
        workout = Workout(**data.model_dump(), owner=user)
        return await workout.insert()

    @staticmethod
    async def get_workout(current_user: User, workout_id: UUID) -> WorkoutOut:
        workout = await Workout.find_one(Workout.workout_id == workout_id, Workout.owner.user_id == current_user.user_id, fetch_links=True)
        if not workout:
            raise err.OperationFailure("Workout not found")
        return workout

    @staticmethod
    async def update_workout(current_user: User, workout_id: UUID, data: WorkoutUpdate) -> WorkoutUpdate:
        workout = await WorkoutService.get_workout(current_user=current_user, workout_id=workout_id)
        if not workout:
            raise err.OperationFailure("Workout not found")

        await workout.update({"$set": data.model_dump(exclude_unset=True)})
        await workout.save()
        return workout

    @staticmethod
    async def delete_workout(current_user: User, workout_id: UUID) -> None:
        workout = await WorkoutService.get_workout(current_user=current_user, workout_id=workout_id)
        if not workout:
            raise err.OperationFailure("Workout not found")

        exercises = await ExerciseService.list_exercises(workout=workout, user=current_user)
        for exercise in exercises:
            try:
                await ExerciseService.delete_exercise(user=current_user, exercise_id=exercise.exercise_id)
            except err.OperationFailure:
                raise err.OperationFailure("Exercise deletion failed, try again later.")

        await workout.delete()
        return None