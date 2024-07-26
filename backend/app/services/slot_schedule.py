from app.models import WeekDayEnum
from app.repositories.slot_schedule import SlotScheduleRepo


class SlotScheduleService:
    @staticmethod
    async def get_slot_schedules(branch_id: int, employee_id):
        slots = await SlotScheduleRepo.get_slot_schedules(branch_id, employee_id)

        for slot in slots:
            slot["day"] = slot["day"].name

        return slots


    @staticmethod
    async def create_slot_schedule(slot_id: int, work_place_id: int, day: WeekDayEnum):
        return await SlotScheduleRepo.create_slot_schedule(slot_id, work_place_id, day)
