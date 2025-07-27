from app.db import session
from app.models import Doctor
from sqlalchemy.future import select


class DoctorRepo:
    @staticmethod
    async def create_doctor(
        user_id: int,
        dept_id: int,
        registration_no: int,
        degree: str | None,
        experience: str | None,
    ):
        new_doctor = Doctor(
            user_id=user_id,
            dept_id=dept_id,
            registration_no=registration_no,
            degree=degree,
            experience=experience,
        )
        session().add(new_doctor)
        await session().commit()
        await session().refresh(new_doctor)
        return new_doctor

    @staticmethod
    async def get_doctor(registration_no: int):
        result = await session().execute(
            select(Doctor).filter(Doctor.registration_no == registration_no)
        )
        doctor = result.scalar_one_or_none()
        return doctor if doctor else None
