import datetime
from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.slot import SlotService

router = APIRouter()


class SlotSchema:
    class BaseSchema(BaseModel):
        start_at: datetime.datetime
        end_at: datetime.datetime

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/slots",
    response_model=list[SlotSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_slots():
    return await SlotService.get_slots()


@router.post(
    "/slots",
    response_model=SlotSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_slot(slot: SlotSchema.CreateInput):
    return await SlotService.create_slot(slot.start_at, slot.end_at)
