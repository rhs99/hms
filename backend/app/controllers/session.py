from fastapi import APIRouter, status
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


@router.post(
    "/sessions",
    response_model=SessionSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def create_session(credentials: SessionSchema.CreateInput):
    return await UserService.sign_in(
        credentials.user_name,
        credentials.password,
    )
