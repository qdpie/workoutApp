from typing import List
from uuid import UUID
import pymongo.errors as err
from app.models.exercise_model import Exercise
from app.schemas.exercise_schema import ExerciseOut, ExerciseUpdate, ExerciseCreate
from app.models.workout_model import Workout
from app.models.user_model import User

class ExerciseService:
    @staticmethod
    async def get_current_exercise(exercise_id: UUID) -> Exercise:
        exercise = await Exercise.find_one(Exercise.exercise_id == exercise_id)
        if not exercise:
            raise err.OperationFailure(code=404, details="Exercise not found")
        return exercise

    @staticmethod
    async def list_all_exercises(user: User) -> List[ExerciseOut]:
        return await Exercise.find(Exercise.owner.user_id == user.user_id, fetch_links=True).to_list()

    @staticmethod
    async def list_exercises(workout: Workout, user: User) -> List[ExerciseOut]:
        return await Exercise.find(
            Exercise.owner.user_id == user.user_id
            and
            Exercise.workout.workout_id == workout.workout_id,
            fetch_links=True
        ).to_list()

    #Create an exercise
    @staticmethod
    async def create_exercise(user: User, workout: Workout, data: ExerciseCreate) -> ExerciseOut:
        exercise = Exercise(**data.model_dump(), owner=user, workout=workout)
        await exercise.insert()
        if not exercise:
            raise err.OperationFailure("Exercise not created")
        if exercise.type == 'cardio':
            await exercise.update({"$set": {"track_reps": False, "track_weight": False, "track_distance": True, "track_duration": True}})
            await exercise.save()
        if exercise.type == 'strength' or exercise.type == 'olympic_weightlifting' or exercise.type == 'plyometrics' or exercise.type == 'powerlifting' or exercise.type == 'strongman':
            await exercise.update({"$set": {"track_distance": False, "track_duration": False, "track_reps": True, "track_weight": True}})
            await exercise.save()
        if exercise.type == 'stretching':
            await exercise.update({"$set": {"track_distance": False, "track_duration": False, "track_reps": False, "track_weight": False}})
            await exercise.save()
        return exercise

    #list exercise by id
    @staticmethod
    async def get_exercise(user: User, exercise_id: UUID) -> ExerciseOut:
        exercise = await Exercise.find_one(Exercise.exercise_id == exercise_id, Exercise.owner.user_id == user.user_id, fetch_links=True)
        if not exercise:
            raise err.OperationFailure("Exercise not found")
        return exercise


    #update an exercise
    @staticmethod
    async def update_exercise(user: User, exercise_id: UUID, data: ExerciseUpdate) -> ExerciseOut:
        exercise = await Exercise.find_one(Exercise.exercise_id == exercise_id, Exercise.owner.user_id == user.user_id, fetch_links=True)
        if not exercise:
            raise err.OperationFailure("Exercise not found")

        await exercise.update({"$set": data.model_dump(exclude_unset=True)})
        await exercise.save()
        return exercise

    #delete an exercise
    @staticmethod
    async def delete_exercise(user: User, exercise_id: UUID) -> None:
        exercise = await Exercise.find_one(Exercise.exercise_id == exercise_id, Exercise.owner.user_id == user.user_id, fetch_links=True)
        if not exercise:
            raise err.OperationFailure("Exercise not found")

        await exercise.delete()
        return None
