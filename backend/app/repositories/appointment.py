import datetime
from sqlalchemy.future import select

from app.db import session
from app.models import Appointment, User


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

    @staticmethod
    async def get_appointments(slot_schedule_id: int, date: datetime.date):

        results = await session().execute(
            select(User.full_name, Appointment.created_at)
            .filter(
                Appointment.slot_schedule_id == slot_schedule_id,
                Appointment.date == date,
            )
            .filter(User.id == Appointment.patient_id)
        )
        appointments = [res for res in results.all()]
        return [
            {"name": appointment[0], "created_at": appointment[1]}
            for appointment in appointments
        ]
