from fastapi import APIRouter, status
from pydantic import BaseModel

from app.models import WeekDayEnum
from app.services.slot_schedule import SlotScheduleService

router = APIRouter()


class SlotScheduleSchema:
    class BaseSchema(BaseModel):
        slot_id: int
        work_place_id: int
        day: WeekDayEnum

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/slot-schedules",
    response_model=list[SlotScheduleSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_slot_schedules(work_place_id: int):
    return await SlotScheduleService.get_slot_schedules(work_place_id)


@router.post(
    "/slot-schedules",
    response_model=SlotScheduleSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_slot_schedule(slot_schedule: SlotScheduleSchema.CreateInput):
    return await SlotScheduleService.create_slot_schedule(
        slot_schedule.slot_id, slot_schedule.work_place_id, slot_schedule.day
    )
