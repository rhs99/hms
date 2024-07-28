import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.user import UserService
from app.models import GenderEnum, BloodGroupEnum

router = APIRouter()


class UserSchema:
    class BaseSchema(BaseModel):
        user_name: str

    class CreateUser(BaseSchema):
        password: str
        full_name: str
        email: str
        phone: str
        dob: datetime.date
        gender: GenderEnum
        blood_group: BloodGroupEnum | None = None

    class SignIn(BaseSchema):
        password: str

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
    "/users/sign-up",
    response_model=UserSchema.SignIn,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user: UserSchema.CreateUser):
    return await UserService.create_user(
        user.user_name,
        user.password,
        user.full_name,
        user.email,
        user.phone,
        user.dob,
        user.gender,
        user.blood_group,
    )


@router.post(
    "/users/sign-in",
    response_model=UserSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user: UserSchema.SignIn):
    return await UserService.sign_in(
        user.user_name,
        user.password,
    )
