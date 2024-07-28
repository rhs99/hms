import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.appointment import AppointmentService

router = APIRouter()


class AppointmentSchema:
    class BaseSchema(BaseModel):
        patient_id: int
        slot_schedule_id: int
        parent: int | None = None
        date: datetime.date

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int
        created_at: datetime.datetime

    class UpdateInput(BaseModel):
        details: str


@router.post(
    "/appointments",
    response_model=AppointmentSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_doctor(appointment: AppointmentSchema.CreateInput):
    return await AppointmentService.create_appointment(
        appointment.patient_id,
        appointment.slot_schedule_id,
        appointment.parent,
        appointment.date,
    )


@router.get("/appointments/{appointment_id}", status_code=status.HTTP_200_OK)
async def get_appointment(appointment_id: int):
    return await AppointmentService.get_appointment(appointment_id)


@router.patch("/appointments/{appointment_id}", status_code=status.HTTP_200_OK)
async def update_appointment(appointment_id: int, data: AppointmentSchema.UpdateInput):
    return await AppointmentService.update_appointment(appointment_id, data)


@router.get("/appointments/users/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_appointments(user_id: int):
    return await AppointmentService.get_user_appointments(user_id)


@router.get(
    "/appointments/slot-schedules/{slot_schedule_id}", status_code=status.HTTP_200_OK
)
async def get_slot_schedule_appointments(
    slot_schedule_id: int, date: datetime.date, pending: bool | None = None
):
    return await AppointmentService.get_slot_schedule_appointments(
        slot_schedule_id, date, pending
    )
