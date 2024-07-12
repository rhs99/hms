from sqlalchemy.future import select

from app.db import session
from app.models import Role


class RoleRepo:
    @staticmethod
    async def get_roles():
        roles = await session().scalars(select(Role))
        return [role for role in roles.all()]

    @staticmethod
    async def create_role(name: str):
        new_role = Role(name=name)
        session().add(new_role)
        await session().commit()
        await session().refresh(new_role)
        return new_role
