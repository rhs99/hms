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
        full_name: str | None = None
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


@router.get(
    "/doctors/{doctor_id}",
    response_model=DoctorSchema.Output | None,
    status_code=status.HTTP_200_OK,
)
async def get_doctor_by_id(doctor_id: int):
    return await DoctorService.get_doctor_by_id(doctor_id)


@router.get(
    "/doctors",
    response_model=list[DoctorSchema.Output] | DoctorSchema.Output | None,
    status_code=status.HTTP_200_OK,
)
async def get_doctors(registration_no: int | None = None):
    if registration_no:
        return await DoctorService.get_doctor(registration_no)
    return await DoctorService.get_all_doctors()
