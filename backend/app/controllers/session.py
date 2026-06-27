from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

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
        access_token: str
        token_type: str


@router.post(
    "/sessions",
    response_model=SessionSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def create_session(credentials: SessionSchema.CreateInput):
    result = await UserService.sign_in(
        credentials.user_name,
        credentials.password,
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )
    return result
