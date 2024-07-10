from sqlalchemy.future import select

from app.db import session
from app.models import Department


class DepartmentRepo:
    @staticmethod
    async def get_departments():
        departments = await session().scalars(select(Department))
        return [dept for dept in departments.all()]

    @staticmethod
    async def create_department(name: str):
        new_dept = Department(name=name)
        session().add(new_dept)
        await session().commit()
        await session().refresh(new_dept)
        return new_dept
