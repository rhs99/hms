from app.repositories.hospital import HospitalRepo


class HospitalService:
    @staticmethod
    async def get_hospitals():
        return await HospitalRepo.get_hospitals()

    @staticmethod
    async def get_hospital(hospital_id: int):
        return await HospitalRepo.get_hospital(hospital_id)

    @staticmethod
    async def create_hospital(name: str):
        return await HospitalRepo.create_hospital(name)
