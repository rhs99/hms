import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.user import UserService
from app.models import GenderEnum, BloodGroupEnum

router = APIRouter()


class UserSchema:
    class BaseSchema(BaseModel):
        user_name: str
        password: str
        email: str
        phone: str
        dob: datetime.date
        gender: GenderEnum
        blood_group: BloodGroupEnum | None = None

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/users",
    response_model=UserSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_user(id: int):
    return await UserService.get_user(id)


@router.post(
    "/hospitals",
    response_model=UserSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user: UserSchema.CreateInput):
    return await UserService.create_user(
        user.user_name,
        user.password,
        user.email,
        user.phone,
        user.dob,
        user.gender,
        user.blood_group,
    )
