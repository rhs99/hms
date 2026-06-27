from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.services.branch_dept import BranchDeptService

router = APIRouter()


class BranchDeptSchema:
    class BaseSchema(BaseModel):
        branch_id: int
        dept_id: int

    class CreateInput(BaseModel):
        dept_id: int

    class Dept(BaseModel):
        id: int
        name: str

    class Doctor(BaseModel):
        id: int
        name: str
        degree: str
        experience: str


@router.get(
    "/branches/{branch_id}/departments",
    response_model=list[BranchDeptSchema.Dept],
    status_code=status.HTTP_200_OK,
)
async def get_branch_departments(branch_id: int):
    return await BranchDeptService.get_branch_depts(branch_id)


@router.post(
    "/branches/{branch_id}/departments",
    response_model=BranchDeptSchema.BaseSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_branch_department(branch_id: int, dept: BranchDeptSchema.CreateInput):
    return await BranchDeptService.create_branch_dept(branch_id, dept.dept_id)


@router.get(
    "/branches/{branch_id}/departments/{dept_id}/doctors",
    response_model=list[BranchDeptSchema.Doctor],
    status_code=status.HTTP_200_OK,
)
async def get_branch_department_doctors(branch_id: int, dept_id: int):
    return await BranchDeptService.get_branch_dept_doctors(branch_id, dept_id)
