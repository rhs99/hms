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
