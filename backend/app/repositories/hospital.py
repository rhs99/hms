from sqlalchemy.future import select

from app.db import session
from app.models import Hospital


class HospitalRepo:
    @staticmethod
    async def get_hospitals():
        results = await session().execute(select(Hospital))
        hospitals = results.scalars().all()
        return [
            {
                "id": hospital.id,
                "name": hospital.name,
            }
            for hospital in hospitals
        ]

    @staticmethod
    async def get_hospital(hospital_id: int):
        hospital = await session().get(Hospital, hospital_id)
        if hospital is None:
            return None
        return {
            "id": hospital.id,
            "name": hospital.name,
        }

    @staticmethod
    async def create_hospital(name: str):
        new_hospital = Hospital(name=name)
        session().add(new_hospital)
        await session().commit()
        await session().refresh(new_hospital)
        return new_hospital
