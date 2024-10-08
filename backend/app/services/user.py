import datetime

from app.repositories.user import UserRepo
from app.models import GenderEnum, BloodGroupEnum


class UserService:
    @staticmethod
    async def get_user(id: int):
        return await UserRepo.get_user(id)

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
        return await UserRepo.sign_in(user_name, password)
