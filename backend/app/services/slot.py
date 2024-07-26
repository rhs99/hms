from app.repositories.slot import SlotRepo


class SlotService:
    @staticmethod
    async def get_slots():
        return await SlotRepo.get_slots()

    @staticmethod
    async def create_slot(start_at: str, end_at: str):
        return await SlotRepo.create_slot(start_at, end_at)
