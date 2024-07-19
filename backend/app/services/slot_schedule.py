from app.models import WeekDayEnum
from app.repositories.slot_schedule import SlotScheduleRepo


class SlotScheduleService:
    @staticmethod
    async def get_slot_schedules(work_place_id: int):
        return await SlotScheduleRepo.get_slot_schedules(work_place_id)

    @staticmethod
    async def create_slot_schedule(slot_id: int, work_place_id: int, day: WeekDayEnum):
        return await SlotScheduleRepo.create_slot_schedule(slot_id, work_place_id, day)
