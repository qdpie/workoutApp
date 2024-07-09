from fastapi import FastAPI
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from fastapi.openapi.utils import get_openapi
import certifi
from fastapi.middleware.cors import CORSMiddleware
from beanie import init_beanie
from bson.binary import UuidRepresentation

from app.routes.user import user_router
from app.routes.auth import auth_router
from app.routes.workout import workout_router
from app.routes.goal import goal_router
from app.routes.exercise import exercise_router
from app.routes.session import session_router
from app.routes.exercise_instance import exercise_instance_router
from app.routes.generate import generate_router

from app.models.user_model import User
from app.models.workout_model import Workout
from app.models.goal_model import Goal
from app.models.exercise_model import Exercise, ExerciseInstance
from app.models.session_model import Session

app = FastAPI()

# origins = [
#     "http://localhost:8081",  # allow this origin
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,  # Allow cookies to be included in the requests
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.APP_NAME,
        version="0.0.1",
        description="OpenAPI Schema for ShapeShift",
        routes=app.routes,
    )
    if settings.DEBUG_MODE:
        openapi_schema["servers"]= [
            {
                "url": f"http://{settings.HOST}:{settings.PORT}"
            }
        ]
    else:
        openapi_schema["servers"]= [
            {
                "url": "https://shapeshift-backend.onrender.com"
            }
        ]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL, tlsCAFile=certifi.where(), UuidRepresentation="pythonLegacy")
    app.mongodb = app.mongodb_client[settings.DB_NAME]

    await init_beanie(
        database = app.mongodb,
        document_models=[
            User,
            Workout,
            Goal,
            Exercise,
            Session,
            ExerciseInstance
        ]
    )

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

@app.get("/", tags=["ping"])
def ping():
    return {"message:": f"Server is working, go to http://{settings.HOST}:{settings.PORT}/docs for api docs"}

# app.include_router(profile_router, tags=["profiles"], prefix="/api/v1/user")
app.include_router(user_router, tags=["users"], prefix=f"{settings.API_V1_STR}/user")
app.include_router(auth_router, tags=["auth"], prefix=f"{settings.API_V1_STR}/auth")
app.include_router(workout_router, tags=["workouts"], prefix=f"{settings.API_V1_STR}/workout")
app.include_router(goal_router, tags=["goals"], prefix=f"{settings.API_V1_STR}/goal")
app.include_router(exercise_router, tags=["exercises"], prefix=f"{settings.API_V1_STR}/exercise")
app.include_router(session_router, tags=["sessions"], prefix=f"{settings.API_V1_STR}/session")
app.include_router(exercise_instance_router, tags=["exercise-instances"], prefix=f"{settings.API_V1_STR}/exercise-instance")
app.include_router(generate_router, tags=["generate"], prefix=f"{settings.API_V1_STR}/generate")

app.openapi = custom_openapi

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG_MODE)