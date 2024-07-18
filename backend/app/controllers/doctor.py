from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.doctor import DoctorService

router = APIRouter()


class DoctorSchema:
    class BaseSchema(BaseModel):
        user_id: int
        dept_id: int
        registration_no: int
        degree: str | None = None
        experience: str | None = None

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        pass


@router.post(
    "/doctors",
    response_model=DoctorSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_doctor(doctor: DoctorSchema.CreateInput):
    return await DoctorService.create_doctor(
        doctor.user_id,
        doctor.dept_id,
        doctor.registration_no,
        doctor.degree,
        doctor.experience,
    )
