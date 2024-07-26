from sqlalchemy.future import select

from app.db import session
from app.models import SlotSchedule, WorkPlace, Slot, WeekDayEnum


class SlotScheduleRepo:
    @staticmethod
    async def get_slot_schedules(branch_id: int, employee_id: int):
        results = await session().execute(
            select(SlotSchedule.id, Slot.start_at, Slot.end_at, SlotSchedule.day)
            .filter(
                WorkPlace.branch_id == branch_id, WorkPlace.employee_id == employee_id
            )
            .filter(WorkPlace.id == SlotSchedule.work_place_id)
            .filter(SlotSchedule.slot_id == Slot.id)
        )
        slots = [res for res in results.all()]
        return [
            {"id": slot[0], "start_at": slot[1], "end_at": slot[2], "day": slot[3]}
            for slot in slots
        ]

    @staticmethod
    async def create_slot_schedule(slot_id: int, work_place_id: int, day: WeekDayEnum):
        new_slot_schedule = SlotSchedule(
            slot_id=slot_id, work_place_id=work_place_id, day=day
        )
        session().add(new_slot_schedule)
        await session().commit()
        await session().refresh(new_slot_schedule)
        return new_slot_schedule
