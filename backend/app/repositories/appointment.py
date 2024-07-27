import datetime
from sqlalchemy import desc
from sqlalchemy.future import select

from app.db import session
from app.models import Appointment, User, SlotSchedule, Slot, Branch, Hospital, WorkPlace, Doctor, Department


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
            .order_by(Appointment.id)
        )
        appointments = [res for res in results.all()]
        return [
            {"name": appointment[0], "created_at": appointment[1]}
            for appointment in appointments
        ]

    @staticmethod
    async def get_user_appointments(user_id: int):

        results = await session().execute(
            select(Appointment.id, Appointment.date, Appointment.parent, Hospital.name, Branch.address, Department.name, User.full_name, Slot.start_at)
            .filter(
                Appointment.patient_id == user_id
            )
            .filter(Appointment.slot_schedule_id == SlotSchedule.id)
            .filter(SlotSchedule.work_place_id == WorkPlace.id)
            .filter(SlotSchedule.slot_id == Slot.id)
            .filter(WorkPlace.branch_id == Branch.id)
            .filter(WorkPlace.employee_id == Doctor.user_id)
            .filter(Doctor.user_id == User.id)
            .filter(Doctor.dept_id == Department.id)
            .filter(Branch.hospital_id == Hospital.id)
            .order_by(desc(Appointment.date))
        )
        appointments = [res for res in results.all()]
        return [
            {
                "id": appointment[0],
                "date": appointment[1],
                "parent": appointment[2],
                "hospital": appointment[3],
                "branch": appointment[4],
                "department": appointment[5],
                "doctor": appointment[6],
                "time": appointment[7],
            }
            for appointment in appointments
        ]


    @staticmethod
    async def get_slot_schedule_appointments(slot_schedule_id: int):

        results = await session().execute(
            select(Appointment.id, Appointment.parent, User.full_name, User.gender)
            .filter(
                Appointment.slot_schedule_id == slot_schedule_id
            )
            .filter(Appointment.patient_id == User.id)
            .order_by(Appointment.id)
        )
        appointments = [res for res in results.all()]
        return [
            {
                "id": appointment[0],
                "parent": appointment[1],
                "full_name": appointment[2],
                "gender": appointment[3],
            }
            for appointment in appointments
        ]

