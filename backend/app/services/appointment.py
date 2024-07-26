import datetime

from app.repositories.appointment import AppointmentRepo


class AppointmentService:
    @staticmethod
    async def create_appointment(
        patient_id: int,
        slot_schedule_id: int,
        parent: int | None,
        date: datetime.date,
    ):
        return await AppointmentRepo.create_appointment(
            patient_id, slot_schedule_id, parent, date
        )

    @staticmethod
    async def get_appointments(slot_schedule_id: int, date: datetime.date):
        return await AppointmentRepo.get_appointments(slot_schedule_id, date)
