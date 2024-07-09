from typing import List
from uuid import UUID
import pymongo.errors as err
from app.models.exercise_model import ExerciseInstance
from app.schemas.exercise_instance_schema import ExerciseInstanceOut, ExerciseInstanceUpdate, ExerciseInstanceCreate
from app.models.exercise_model import Exercise
from app.models.session_model import Session
from app.models.user_model import User

class ExerciseInstanceService:
    @staticmethod
    async def list_exercise_instances_by_exercise(exercise: Exercise, user: User) -> List[ExerciseInstanceOut]:
        exercise_instances = await ExerciseInstance.find(
            ExerciseInstance.owner.user_id == user.user_id
            and
            ExerciseInstance.exercise.exercise_id == exercise.exercise_id,
            fetch_links=True
        ).to_list()

        return exercise_instances

    @staticmethod
    async def list_exercise_instances(session: Session, user: User) -> List[ExerciseInstanceOut]:
        exercise_instances = await ExerciseInstance.find(
            ExerciseInstance.owner.user_id == user.user_id
            and
            ExerciseInstance.session.session_id == session.session_id,
            fetch_links=True
        ).to_list()

        return exercise_instances
    #Create an exercise instance
    @staticmethod
    async def create_exercise_instance(user: User, session: Session, data: ExerciseInstanceCreate) -> ExerciseInstanceOut:
        exercise = await Exercise.find_one(Exercise.exercise_id == data.exercise_id)
        exercise_instance = ExerciseInstance(owner=user, session=session, exercise=exercise)
        await exercise_instance.insert()
        if not exercise_instance:
            raise err.OperationFailure("Exercise instance not created")
        return exercise_instance

    #list exercise instance by id
    @staticmethod
    async def get_exercise_instance(user: User, exercise_instance_id: UUID) -> ExerciseInstanceOut:
        exercise_instance = await ExerciseInstance.find_one(ExerciseInstance.exercise_instance_id == exercise_instance_id, ExerciseInstance.owner.user_id == user.user_id, fetch_links=True)
        if not exercise_instance:
            raise err.OperationFailure("Exercise instance not found")
        return exercise_instance

    #update an exercise instance
    @staticmethod
    async def update_exercise_instance(user: User, exercise_instance_id: UUID, data: ExerciseInstanceUpdate) -> ExerciseInstanceOut:
        exercise_instance = await ExerciseInstance.find_one(ExerciseInstance.exercise_instance_id == exercise_instance_id, ExerciseInstance.owner.user_id == user.user_id, fetch_links=True)
        if not exercise_instance:
            raise err.OperationFailure("Exercise instance not found")

        await exercise_instance.update({"$set": data.model_dump(exclude_unset=True)})
        await exercise_instance.save()
        return exercise_instance

    #delete an exercise instance
    @staticmethod
    async def delete_exercise_instance(user: User, exercise_instance_id: UUID) -> None:
        exercise_instance = await ExerciseInstance.find_one(ExerciseInstance.exercise_instance_id == exercise_instance_id, ExerciseInstance.owner.user_id == user.user_id, fetch_links=True)
        if not exercise_instance:
            raise err.OperationFailure("Exercise instance not found")
        await exercise_instance.delete()
        return None