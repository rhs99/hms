from app.repositories.doctor import DoctorRepo
from app.repositories.user import UserRepo


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
        doctor = await DoctorRepo.get_doctor(registration_no)
        if not doctor:
            return None

        user = await UserRepo.get_user(doctor.user_id)

        return {
            "user_id": doctor.user_id,
            "dept_id": doctor.dept_id,
            "registration_no": doctor.registration_no,
            "degree": doctor.degree,
            "experience": doctor.experience,
            "full_name": user["full_name"] if user else None,
        }

    @staticmethod
    async def get_doctor_by_id(doctor_id: int):
        doctor = await DoctorRepo.get_doctor_by_id(doctor_id)
        if not doctor:
            return None
        user = await UserRepo.get_user(doctor.user_id)

        return {
            "user_id": doctor.user_id,
            "dept_id": doctor.dept_id,
            "registration_no": doctor.registration_no,
            "degree": doctor.degree,
            "experience": doctor.experience,
            "full_name": user["full_name"] if user else None,
        }

    @staticmethod
    async def get_all_doctors():
        doctors = await DoctorRepo.get_all_doctors()
        result = []
        for doctor in doctors:
            user = await UserRepo.get_user(doctor.user_id)
            result.append(
                {
                    "user_id": doctor.user_id,
                    "dept_id": doctor.dept_id,
                    "registration_no": doctor.registration_no,
                    "degree": doctor.degree,
                    "experience": doctor.experience,
                    "full_name": user["full_name"] if user else None,
                }
            )
        return result
