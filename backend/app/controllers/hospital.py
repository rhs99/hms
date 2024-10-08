from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.hospital import HospitalService

router = APIRouter()


class HospitalSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int

    class ExtendedOutput(BaseSchema):
        address: str
        phone: str
        email: str
        branch_id: int


@router.get(
    "/hospitals",
    response_model=list[HospitalSchema.ExtendedOutput],
    status_code=status.HTTP_200_OK,
)
async def get_hospitals():
    return await HospitalService.get_hospitals()


@router.post(
    "/hospitals",
    response_model=HospitalSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_hospital(hospital: HospitalSchema.CreateInput):
    return await HospitalService.create_hospital(hospital.name)
