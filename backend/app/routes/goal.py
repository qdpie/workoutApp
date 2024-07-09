from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from app.models.user_model import User
from app.actions.user_service import UserService
from app.schemas.goal_schema import GoalCreate, GoalUpdate, GoalOut
from app.actions.goal_service import GoalService
from app.models.goal_model import Goal

goal_router = APIRouter()

@goal_router.get('/',operation_id="getGoals", summary="Get all goals", response_model=List[GoalOut])
async def get_goals(user: User = Depends(UserService.get_current_user)) -> List[Goal]:
    return await GoalService.list_goals(user=user)

@goal_router.post('/',operation_id="createGoal", summary="Create a goal", response_model=Goal)
async def create_goal(data: GoalCreate, user: User = Depends(UserService.get_current_user)) -> Goal:
    return await GoalService.create_goal(user=user, data=data)

@goal_router.get('/{goal_id}',operation_id="getGoal", summary="Get a single goal", response_model=GoalOut)
async def get_goal(goal_id: UUID, user: User = Depends(UserService.get_current_user)) -> GoalOut:
    return await GoalService.get_goal(current_user=user, goal_id=goal_id)

@goal_router.put('/{goal_id}',operation_id="updateGoals", summary="Update a goal", response_model=GoalOut)
async def update_goal(goal_id: UUID, data: GoalUpdate, user: User = Depends(UserService.get_current_user)) -> GoalUpdate:
    return await GoalService.update_goal(current_user=user, goal_id=goal_id, data=data)

@goal_router.delete('/{goal_id}',operation_id="deleteGoal", summary="Delete a goal")
async def delete_goal(goal_id: UUID, user: User = Depends(UserService.get_current_user)) -> None:
    return await GoalService.delete_goal(current_user=user, goal_id=goal_id)