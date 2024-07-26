import datetime

from app.db import session
from app.models import User, GenderEnum, BloodGroupEnum


class UserRepo:
    @staticmethod
    async def get_user(id: int):
        return await session().get(User, id)

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
        new_user = User(
            user_name=user_name,
            password=password,
            full_name=full_name,
            email=email,
            phone=phone,
            dob=dob,
            gender=gender,
            blood_group=blood_group,
        )
        session().add(new_user)
        await session().commit()
        await session().refresh(new_user)
        return new_user
