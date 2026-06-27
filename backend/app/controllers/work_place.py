import datetime
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.services.work_place import WorkPlaceService

router = APIRouter()


class WorkPlaceSchema:
    class BaseSchema(BaseModel):
        branch_id: int
        employee_id: int
        start_date: datetime.date
        end_date: datetime.date | None = None

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/employees/{employee_id}/work-places",
    status_code=status.HTTP_200_OK,
)
async def get_employee_workplaces(employee_id: int):
    return await WorkPlaceService.get_work_places(employee_id)


@router.get(
    "/work-places",
    response_model=WorkPlaceSchema.Output | None,
    status_code=status.HTTP_200_OK,
)
async def get_work_place(branch_id: int, employee_id: int):
    return await WorkPlaceService.get_work_place(branch_id, employee_id)


@router.post(
    "/work-places",
    response_model=WorkPlaceSchema.Output,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_work_place(work_place: WorkPlaceSchema.CreateInput):
    return await WorkPlaceService.create_work_place(
        work_place.branch_id,
        work_place.employee_id,
        work_place.start_date,
        work_place.end_date,
    )
