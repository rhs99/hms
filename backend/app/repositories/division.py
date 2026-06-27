from sqlalchemy.future import select

from app.db import session
from app.models import Division


class DivisionRepo:
    @staticmethod
    async def get_divisions():
        results = await session().execute(select(Division).order_by(Division.name))
        return [{"id": d.id, "name": d.name} for d in results.scalars().all()]

    @staticmethod
    async def get_division(division_id: int):
        division = await session().get(Division, division_id)
        if division is None:
            return None
        return {"id": division.id, "name": division.name}

    @staticmethod
    async def create_division(name: str):
        new_division = Division(name=name)
        session().add(new_division)
        await session().commit()
        await session().refresh(new_division)
        return new_division
