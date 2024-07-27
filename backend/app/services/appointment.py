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
    async def get_appointment(appointment_id: int):
        appointment = await AppointmentRepo.get_appointment(appointment_id)
        appointment["gender"] = appointment["gender"].name.capitalize()
        appointment["blood_group"] = appointment["blood_group"].name
        return appointment

    @staticmethod
    async def update_appointment(appointment_id: int, data):
        return await AppointmentRepo.update_appointment(appointment_id, data)

    @staticmethod
    async def get_user_appointments(user_id: int):
        return await AppointmentRepo.get_user_appointments(user_id)

    @staticmethod
    async def get_slot_schedule_appointments(
        slot_schedule_id: int, date: datetime.date
    ):
        appointments = await AppointmentRepo.get_slot_schedule_appointments(
            slot_schedule_id, date
        )

        for appointment in appointments:
            appointment["gender"] = appointment["gender"].name.capitalize()

        return appointments
