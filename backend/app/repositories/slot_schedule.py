from sqlalchemy.future import select

from app.db import session
from app.models import SlotSchedule, WeekDayEnum


class SlotScheduleRepo:
    @staticmethod
    async def get_slot_schedules(work_place_id: int):
        slot_schedules = await session().scalars(
            select(SlotSchedule).where(SlotSchedule.work_place_id == work_place_id)
        )
        return [slot_schedule for slot_schedule in slot_schedules.all()]

    @staticmethod
    async def create_slot_schedule(slot_id: int, work_place_id: int, day: WeekDayEnum):
        new_slot_schedule = SlotSchedule(
            slot_id=slot_id, work_place_id=work_place_id, day=day
        )
        session().add(new_slot_schedule)
        await session().commit()
        await session().refresh(new_slot_schedule)
        return new_slot_schedule
