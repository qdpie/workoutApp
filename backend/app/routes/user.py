from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import UserAuth, UserOut, UserUpdate
from fastapi import Depends
from app.actions.user_service import UserService
import pymongo.errors as err
from app.models.user_model import User
from app.models.err_model import ErrorResponse

user_router = APIRouter()

@user_router.post("/create",operation_id="createUser", summary="Create a new user", response_model=UserOut,
                responses={
                    400: {"model": ErrorResponse, "description": "Bad Request - User with this email or username already exists"},
                    500: {"model": ErrorResponse, "description": "Internal Server Error - An unexpected error occurred"}
                },)
async def create_user(user: UserAuth) -> UserOut:
    try:
        return await UserService.create_user(user)
    except err.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    except Exception as e:
        # Log the exception for debugging purposes
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while processing your request."
        )

@user_router.get("/me",operation_id="getCurrentUser", summary="Get current user", response_model=UserOut)
async def get_current_user(current_user: User = Depends(UserService.get_current_user)) -> UserOut:
    return current_user

@user_router.put("/update",operation_id="updateCurrentUser", summary="Update current user", response_model=UserOut)
async def update_current_user(data: UserUpdate, current_user: User = Depends(UserService.get_current_user)) -> UserOut:
    try:
        updated_user = await UserService.update_user(current_user.user_id, data)
        return updated_user
    except err.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )

@user_router.delete("/delete",operation_id="deleteCurrentUser", summary="Delete current user")
async def delete_current_user(current_user: User = Depends(UserService.get_current_user)) -> None:
    await UserService.delete_user(current_user.user_id)
    return