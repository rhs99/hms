from app.repositories.district import DistrictRepo


class DistrictService:
    @staticmethod
    async def get_districts(division_id: int | None = None):
        return await DistrictRepo.get_districts(division_id)

    @staticmethod
    async def get_district(district_id: int):
        return await DistrictRepo.get_district(district_id)

    @staticmethod
    async def create_district(name: str, division_id: int):
        return await DistrictRepo.create_district(name, division_id)
