import datetime

from app.repositories.slot import SlotRepo


class SlotService:
    @staticmethod
    async def get_slots():
        return await SlotRepo.get_slots()

    @staticmethod
    async def create_slot(start_at: datetime.datetime, end_at: datetime.datetime):
        return await SlotRepo.create_slot(start_at, end_at)
