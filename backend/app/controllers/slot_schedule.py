import datetime
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.models import WeekDayEnum
from app.services.slot_schedule import SlotScheduleService
from app.services.appointment import AppointmentService

router = APIRouter()


class SlotScheduleSchema:
    class BaseSchema(BaseModel):
        slot_id: int
        work_place_id: int
        day: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int

    class OutputWithSlot(BaseModel):
        id: int
        start_at: str
        end_at: str
        day: str


@router.get(
    "/slot-schedules",
    response_model=list[SlotScheduleSchema.OutputWithSlot],
    status_code=status.HTTP_200_OK,
)
async def get_slot_schedules(branch_id: int, employee_id: int):
    return await SlotScheduleService.get_slot_schedules(branch_id, employee_id)


@router.post(
    "/slot-schedules",
    response_model=SlotScheduleSchema.Output,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_slot_schedule(slot_schedule: SlotScheduleSchema.CreateInput):
    day_enum = WeekDayEnum[slot_schedule.day]
    return await SlotScheduleService.create_slot_schedule(
        slot_schedule.slot_id, slot_schedule.work_place_id, day_enum
    )


@router.get(
    "/slot-schedules/{slot_schedule_id}",
    response_model=SlotScheduleSchema.OutputWithSlot,
    status_code=status.HTTP_200_OK,
)
async def get_slot_schedule(slot_schedule_id: int):
    return await SlotScheduleService.get_slot_schedule(slot_schedule_id)


@router.get(
    "/slot-schedules/{slot_schedule_id}/appointments",
    status_code=status.HTTP_200_OK,
)
async def get_slot_schedule_appointments(
    slot_schedule_id: int, date: datetime.date, pending: bool | None = None
):
    return await AppointmentService.get_slot_schedule_appointments(
        slot_schedule_id, date, pending
    )
