import datetime
from sqlalchemy.future import select

from app.db import session
from app.models import User, GenderEnum, BloodGroupEnum


class UserRepo:
    def _get_user_result(user):
        if user is None:
            return None
        return {
            "id": user.id,
            "user_name": user.user_name,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "dob": user.dob,
            "gender": GenderEnum(user.gender).name if user.gender else "N/A",
            "blood_group": (
                BloodGroupEnum(user.blood_group).name if user.blood_group else "N/A"
            ),
        }

    @staticmethod
    async def get_user(id: int):
        user = await session().get(User, id)
        return UserRepo._get_user_result(user)

    @staticmethod
    async def get_user_by_username(user_name: str):
        result = await session().execute(
            select(User).filter(User.user_name == user_name)
        )
        user = result.scalar_one_or_none()

        return UserRepo._get_user_result(user)

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

    @staticmethod
    async def sign_in(user_name: str, password: str):
        result = await session().execute(
            select(User.id, User.user_name).filter(
                User.user_name == user_name, User.password == password
            )
        )
        user = result.one_or_none()
        return user
