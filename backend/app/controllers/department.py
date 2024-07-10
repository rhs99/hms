from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.department import DepartmentService

router = APIRouter()


class DepartmentSchema:
    class DepartmentCreateInput(BaseModel):
        name: str

    class Output(BaseModel):
        id: int
        name: str


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
async def create_department(dept: DepartmentSchema.DepartmentCreateInput):
    return await DepartmentService.create_department(dept.name)
