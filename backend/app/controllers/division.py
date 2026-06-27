from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.division import DivisionService

router = APIRouter()


class DivisionSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.post(
    "/divisions",
    response_model=DivisionSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_division(division: DivisionSchema.CreateInput):
    return await DivisionService.create_division(division.name)


@router.get(
    "/divisions/{division_id}",
    response_model=DivisionSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_division(division_id: int):
    return await DivisionService.get_division(division_id)


@router.get(
    "/divisions",
    response_model=list[DivisionSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_divisions():
    return await DivisionService.get_divisions()
