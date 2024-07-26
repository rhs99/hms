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


@router.post(
    "/appointemnt",
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
