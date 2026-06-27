from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.thana import ThanaService

router = APIRouter()


class ThanaSchema:
    class BaseSchema(BaseModel):
        name: str
        district_id: int

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.post(
    "/thanas",
    response_model=ThanaSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_thana(thana: ThanaSchema.CreateInput):
    return await ThanaService.create_thana(thana.name, thana.district_id)


@router.get(
    "/thanas/{thana_id}",
    response_model=ThanaSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_thana(thana_id: int):
    return await ThanaService.get_thana(thana_id)


@router.get(
    "/thanas",
    response_model=list[ThanaSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_thanas(district_id: int | None = None):
    return await ThanaService.get_thanas(district_id)
