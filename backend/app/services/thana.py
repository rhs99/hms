from app.repositories.thana import ThanaRepo


class ThanaService:
    @staticmethod
    async def get_thanas(district_id: int | None = None):
        return await ThanaRepo.get_thanas(district_id)

    @staticmethod
    async def get_thana(thana_id: int):
        return await ThanaRepo.get_thana(thana_id)

    @staticmethod
    async def create_thana(name: str, district_id: int):
        return await ThanaRepo.create_thana(name, district_id)
