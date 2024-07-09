from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.schemas.exercise_schema import ExerciseGPTData, ExerciseGPTOut
from app.actions.ai_service import AIService
from app.models.user_model import User
from app.actions.user_service import UserService

generate_router = APIRouter()

@generate_router.post('/',operation_id="generateWorkoutPlan", summary="Generate a workout plan")
async def generate_workout_plan(data: ExerciseGPTData, user: User = Depends(UserService.get_current_user)) -> ExerciseGPTOut:
    workout_plan = await AIService.create_workout_plan(data=data)
    return workout_plan