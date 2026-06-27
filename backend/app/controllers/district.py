from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.services.district import DistrictService

router = APIRouter()


class DistrictSchema:
    class BaseSchema(BaseModel):
        name: str
        division_id: int

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.post(
    "/districts",
    response_model=DistrictSchema.Output,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_district(district: DistrictSchema.CreateInput):
    return await DistrictService.create_district(district.name, district.division_id)


@router.get(
    "/districts/{district_id}",
    response_model=DistrictSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_district(district_id: int):
    return await DistrictService.get_district(district_id)


@router.get(
    "/districts",
    response_model=list[DistrictSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_districts(division_id: int | None = None):
    return await DistrictService.get_districts(division_id)
