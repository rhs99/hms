import datetime

from app.db import session
from app.models import Appointment


class AppointmentRepo:
    @staticmethod
    async def create_appointment(
        patient_id: int,
        slot_schedule_id: int,
        parent: int | None,
        date: datetime.date,
    ):
        new_appointment = Appointment(
            patient_id=patient_id,
            slot_schedule_id=slot_schedule_id,
            parent=parent,
            date=date,
            created_at=datetime.datetime.now(),
        )
        session().add(new_appointment)
        await session().commit()
        await session().refresh(new_appointment)
        return new_appointment
