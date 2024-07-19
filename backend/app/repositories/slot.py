import datetime
from sqlalchemy.future import select

from app.db import session
from app.models import Slot


class SlotRepo:
    @staticmethod
    async def get_slots():
        slots = await session().scalars(select(Slot))
        return [slot for slot in slots.all()]

    @staticmethod
    async def create_slot(start_at: datetime.datetime, end_at: datetime.datetime):
        new_slot = Slot(start_at=start_at, end_at=end_at)
        session().add(new_slot)
        await session().commit()
        await session().refresh(new_slot)
        return new_slot
