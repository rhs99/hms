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
        email: str,
        phone: str,
        dob: datetime.date,
        gender: GenderEnum,
        blood_group: BloodGroupEnum | None,
    ):
        return await UserRepo.create_user(
            user_name, password, email, phone, dob, gender, blood_group
        )
