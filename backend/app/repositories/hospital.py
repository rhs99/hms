from sqlalchemy.future import select

from app.db import session
from app.models import Hospital


class HospitalRepo:
    @staticmethod
    async def get_hospitals():
        hospitals = await session().scalars(select(Hospital))
        return [hospital for hospital in hospitals.all()]

    @staticmethod
    async def create_hospital(name: str):
        new_hospital = Hospital(name=name)
        session().add(new_hospital)
        await session().commit()
        await session().refresh(new_hospital)
        return new_hospital
