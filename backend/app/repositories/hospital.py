from sqlalchemy.future import select

from app.db import session
from app.models import Hospital, Branch


class HospitalRepo:
    @staticmethod
    async def get_hospitals():
        results = await session().execute(
            select(
                Hospital.id,
                Hospital.name,
                Branch.address,
                Branch.phone,
                Branch.email,
                Branch.id,
            )
            .select_from(Hospital)
            .join(Branch, Hospital.id == Branch.hospital_id)
        )
        hospitals = [res for res in results.all()]

        return [
            {
                "name": hospital[1],
                "address": hospital[2],
                "phone": hospital[3],
                "email": hospital[4],
                "branch_id": hospital[5],
            }
            for hospital in hospitals
        ]

    @staticmethod
    async def create_hospital(name: str):
        new_hospital = Hospital(name=name)
        session().add(new_hospital)
        await session().commit()
        await session().refresh(new_hospital)
        return new_hospital
