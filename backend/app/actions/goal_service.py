from typing import List
from uuid import UUID
import pymongo.errors as err
from app.models.user_model import User
from app.models.goal_model import Goal
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalOut

class GoalService:
    @staticmethod
    async def list_goals(user: User) -> List[GoalOut]:
        return await Goal.find(Goal.owner.user_id == user.user_id, fetch_links=True).to_list()

    @staticmethod
    async def create_goal(user: User, data: GoalCreate) -> Goal:
        goal = Goal(**data.model_dump(), owner=user)
        return await goal.insert()

    @staticmethod
    async def get_goal(current_user: User, goal_id: UUID) -> GoalOut:
        goal = await Goal.find_one(Goal.goal_id == goal_id, Goal.owner.user_id == current_user.user_id, fetch_links=True)
        if not goal:
            raise err.OperationFailure("Goal not found")
        return goal

    @staticmethod
    async def update_goal(current_user: User, goal_id: UUID, data: GoalUpdate) -> GoalUpdate:
        goal = await GoalService.get_goal(current_user=current_user, goal_id=goal_id)

        await goal.update({"$set": data.model_dump(exclude_unset=True)})
        await goal.save()
        return goal

    @staticmethod
    async def delete_goal(current_user: User, goal_id: UUID) -> None:
        goal = await GoalService.get_goal(current_user=current_user, goal_id=goal_id)
        if not goal:
                raise err.OperationFailure("Goal not found")
        await goal.delete()
        return None