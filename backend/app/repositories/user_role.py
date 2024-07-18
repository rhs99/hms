from sqlalchemy.future import select

from app.db import session
from app.models import UserRole


class UserRoleRepo:
    @staticmethod
    async def get_user_roles(user_id: int):
        user_roles = await session().scalars(select(UserRole.user_id == user_id))
        return [user_role for user_role in user_roles.all()]

    @staticmethod
    async def create_user_role(user_id: int, role_id: int):
        new_user_role = UserRole(user_id=user_id, role_id=role_id)
        session().add(new_user_role)
        await session().commit()
        await session().refresh(new_user_role)
        return new_user_role
