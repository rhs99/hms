from sqlalchemy.future import select

from app.db import session
from app.models import District


class DistrictRepo:
    @staticmethod
    async def get_districts(division_id: int | None = None):
        stmt = select(District).order_by(District.name)
        if division_id is not None:
            stmt = stmt.where(District.division_id == division_id)
        results = await session().execute(stmt)
        return [
            {"id": d.id, "name": d.name, "division_id": d.division_id}
            for d in results.scalars().all()
        ]

    @staticmethod
    async def get_district(district_id: int):
        district = await session().get(District, district_id)
        if district is None:
            return None
        return {
            "id": district.id,
            "name": district.name,
            "division_id": district.division_id,
        }

    @staticmethod
    async def create_district(name: str, division_id: int):
        new_district = District(name=name, division_id=division_id)
        session().add(new_district)
        await session().commit()
        await session().refresh(new_district)
        return new_district
