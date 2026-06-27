from sqlalchemy.future import select

from app.db import session
from app.models import Thana


class ThanaRepo:
    @staticmethod
    async def get_thanas(district_id: int | None = None):
        stmt = select(Thana).order_by(Thana.name)
        if district_id is not None:
            stmt = stmt.where(Thana.district_id == district_id)
        results = await session().execute(stmt)
        return [
            {"id": t.id, "name": t.name, "district_id": t.district_id}
            for t in results.scalars().all()
        ]

    @staticmethod
    async def get_thana(thana_id: int):
        thana = await session().get(Thana, thana_id)
        if thana is None:
            return None
        return {
            "id": thana.id,
            "name": thana.name,
            "district_id": thana.district_id,
        }

    @staticmethod
    async def create_thana(name: str, district_id: int):
        new_thana = Thana(name=name, district_id=district_id)
        session().add(new_thana)
        await session().commit()
        await session().refresh(new_thana)
        return new_thana
