from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.department import DepartmentService

router = APIRouter()


class DepartmentSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/departments",
    response_model=list[DepartmentSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_departments():
    return await DepartmentService.get_departments()


@router.post(
    "/departments",
    response_model=DepartmentSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_department(dept: DepartmentSchema.CreateInput):
    return await DepartmentService.create_department(dept.name)
