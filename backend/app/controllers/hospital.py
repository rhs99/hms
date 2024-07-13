from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.hospital import HospitalService

router = APIRouter()


class HospitalSchema:
    class BaseSchema(BaseModel):
        name: str
        address: str
        phone: str | None = None
        email: str | None = None

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int



@router.get(
    "/hospitals",
    response_model=list[HospitalSchema.Output],
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
    return await HospitalService.create_hospital(hospital.name, hospital.address, hospital.phone, hospital.email)
