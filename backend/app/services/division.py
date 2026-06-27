from app.repositories.division import DivisionRepo


class DivisionService:
    @staticmethod
    async def get_divisions():
        return await DivisionRepo.get_divisions()

    @staticmethod
    async def get_division(division_id: int):
        return await DivisionRepo.get_division(division_id)

    @staticmethod
    async def create_division(name: str):
        return await DivisionRepo.create_division(name)
