from app.repositories.doctor import DoctorRepo


class DoctorService:
    @staticmethod
    async def create_doctor(
        user_id: int,
        dept_id: int,
        registration_no: int,
        degree: str | None,
        experience: str | None,
    ):
        return await DoctorRepo.create_doctor(
            user_id, dept_id, registration_no, degree, experience
        )


    @staticmethod
    async def get_doctor(registration_no: int):
        return await DoctorRepo.get_doctor(registration_no)
