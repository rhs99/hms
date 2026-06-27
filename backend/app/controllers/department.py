from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.services.department import DepartmentService

router = APIRouter()


class DepartmentSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.post(
    "/departments",
    response_model=DepartmentSchema.Output,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_department(dept: DepartmentSchema.CreateInput):
    return await DepartmentService.create_department(dept.name)


@router.get(
    "/departments/{dept_id}",
    response_model=DepartmentSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_department(dept_id: int):
    return await DepartmentService.get_department(dept_id)


@router.get(
    "/departments",
    response_model=list[DepartmentSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_departments():
    return await DepartmentService.get_departments()
