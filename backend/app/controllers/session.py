from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel

from app.auth import (
    clear_session_cookies,
    create_csrf_token,
    set_session_cookies,
)
from app.services.user import UserService

router = APIRouter()


class SessionSchema:
    class CreateInput(BaseModel):
        user_name: str
        password: str

    class Output(BaseModel):
        user_name: str
        id: int
        is_admin: bool
        is_doctor: bool


@router.post(
    "/sessions",
    response_model=SessionSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def create_session(response: Response, credentials: SessionSchema.CreateInput):
    result = await UserService.sign_in(
        credentials.user_name,
        credentials.password,
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )
    csrf = create_csrf_token()
    set_session_cookies(response, result["access_token"], csrf)
    return {
        "user_name": result["user_name"],
        "id": result["id"],
        "is_admin": result["is_admin"],
        "is_doctor": result["is_doctor"],
    }


@router.delete("/sessions", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(response: Response):
    clear_session_cookies(response)
    response.status_code = status.HTTP_204_NO_CONTENT
