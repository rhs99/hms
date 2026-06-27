import datetime

from app.auth import create_access_token, is_user_admin, is_user_doctor
from app.repositories.user import UserRepo
from app.models import GenderEnum, BloodGroupEnum


class UserService:
    @staticmethod
    async def get_user(id: int):
        return await UserRepo.get_user(id)

    @staticmethod
    async def get_user_by_username(user_name: str):
        return await UserRepo.get_user_by_username(user_name)

    @staticmethod
    async def create_user(
        user_name: str,
        password: str,
        full_name: str,
        email: str,
        phone: str,
        dob: datetime.date,
        gender: GenderEnum,
        blood_group: BloodGroupEnum | None,
    ):
        return await UserRepo.create_user(
            user_name, password, full_name, email, phone, dob, gender, blood_group
        )

    @staticmethod
    async def sign_in(user_name: str, password: str):
        user = await UserRepo.sign_in(user_name, password)
        if user is None:
            return None
        is_admin = await is_user_admin(user.id)
        is_doctor = await is_user_doctor(user.id)
        return {
            "id": user.id,
            "user_name": user.user_name,
            "is_admin": is_admin,
            "is_doctor": is_doctor,
            "access_token": create_access_token(user.id, is_admin),
        }
