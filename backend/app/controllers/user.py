import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.user import UserService
from app.services.appointment import AppointmentService
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

    class Output(BaseSchema):
        id: int

    class UserDetails(BaseSchema):
        id: int
        full_name: str
        email: str
        phone: str
        dob: datetime.date | None = None
        gender: str
        blood_group: str | None = None


@router.post(
    "/users",
    response_model=UserSchema.Output,
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


@router.get(
    "/users/{user_id}",
    response_model=UserSchema.UserDetails | None,
    status_code=status.HTTP_200_OK,
)
async def get_user(user_id: int):
    return await UserService.get_user(user_id)


@router.get(
    "/users",
    response_model=UserSchema.UserDetails | None,
    status_code=status.HTTP_200_OK,
)
async def search_user(username: str | None = None):
    if username is not None:
        return await UserService.get_user_by_username(username)
    return None


@router.get("/users/{user_id}/appointments", status_code=status.HTTP_200_OK)
async def get_user_appointments(user_id: int, past: bool | None = None):
    return await AppointmentService.get_user_appointments(user_id, past)
