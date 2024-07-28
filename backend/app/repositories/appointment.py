import datetime
from sqlalchemy import desc
from sqlalchemy.future import select

from app.db import session
from app.models import (
    Appointment,
    User,
    SlotSchedule,
    Slot,
    Branch,
    Hospital,
    WorkPlace,
    Doctor,
    Department,
)


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
    async def get_appointment(appointment_id: int):
        results = await session().execute(
            select(
                User.full_name,
                User.gender,
                User.dob,
                User.blood_group,
            )
            .filter(Appointment.id == appointment_id)
            .filter(User.id == Appointment.patient_id)
        )
        patient_data = results.one_or_none()
        data = {
            "name": patient_data[0],
            "gender": patient_data[1],
            "dob": patient_data[2],
            "blood_group": patient_data[3],
        }

        results = await session().execute(
            select(
                Appointment.date,
                Appointment.parent,
                Appointment.details,
                Hospital.name,
                Branch.address,
                Branch.phone,
                Branch.email,
                Department.name,
                User.full_name,
                Doctor.degree,
                Slot.start_at,
            )
            .join(SlotSchedule, Appointment.slot_schedule_id == SlotSchedule.id)
            .join(WorkPlace, SlotSchedule.work_place_id == WorkPlace.id)
            .join(Slot, SlotSchedule.slot_id == Slot.id)
            .join(Branch, WorkPlace.branch_id == Branch.id)
            .join(User, WorkPlace.employee_id == User.id)
            .join(Doctor, User.id == Doctor.user_id)
            .join(Department, Doctor.dept_id == Department.id)
            .join(Hospital, Branch.hospital_id == Hospital.id)
            .filter(Appointment.id == appointment_id)
        )

        appointment_data = results.one_or_none()

        data.update(
            {
                "id": appointment_id,
                "date": appointment_data[0],
                "parent": appointment_data[1],
                "details": appointment_data[2],
                "hospital": appointment_data[3],
                "branch": appointment_data[4],
                "phone": appointment_data[5],
                "email": appointment_data[6],
                "dept": appointment_data[7],
                "doctor": appointment_data[8],
                "degree": appointment_data[9],
                "slot": appointment_data[10],
            }
        )

        return data

    @staticmethod
    async def update_appointment(appointment_id: int, data):
        appointment = await session().get(Appointment, appointment_id)
        appointment.details = data.details
        await session().commit()

    @staticmethod
    async def get_user_appointments(user_id: int):

        results = await session().execute(
            select(
                Appointment.id,
                Appointment.date,
                Appointment.parent,
                Hospital.name,
                Branch.address,
                Department.name,
                User.full_name,
                Slot.start_at,
                Appointment.details,
            )
            .join(SlotSchedule, Appointment.slot_schedule_id == SlotSchedule.id)
            .join(WorkPlace, SlotSchedule.work_place_id == WorkPlace.id)
            .join(Slot, SlotSchedule.slot_id == Slot.id)
            .join(Branch, WorkPlace.branch_id == Branch.id)
            .join(User, WorkPlace.employee_id == User.id)
            .join(Doctor, User.id == Doctor.user_id)
            .join(Department, Doctor.dept_id == Department.id)
            .join(Hospital, Branch.hospital_id == Hospital.id)
            .filter(Appointment.patient_id == user_id)
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
                "is_resolved": appointment[8] != None,
            }
            for appointment in appointments
        ]

    @staticmethod
    async def get_slot_schedule_appointments(
        slot_schedule_id: int, date: datetime.date, pending: bool | None
    ):
        stmt = (
            select(
                Appointment.id,
                Appointment.parent,
                Appointment.created_at,
                User.full_name,
                User.gender,
            )
            .filter(
                Appointment.slot_schedule_id == slot_schedule_id,
                Appointment.date == date,
            )
            .join(User, User.id == Appointment.patient_id)
        )

        if pending == True:
            stmt = stmt.filter(Appointment.details == None).order_by(Appointment.id)
        elif pending == False:
            stmt = stmt.filter(Appointment.details != None).order_by(
                desc(Appointment.id)
            )

        results = await session().execute(stmt)

        appointments = [res for res in results.all()]

        return [
            {
                "id": appointment[0],
                "parent": appointment[1],
                "created_at": appointment[2],
                "full_name": appointment[3],
                "gender": appointment[4],
            }
            for appointment in appointments
        ]
