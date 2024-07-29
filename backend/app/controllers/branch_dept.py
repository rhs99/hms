from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.branch_dept import BranchDeptService

router = APIRouter()


class BranchDeptSchema:
    class BaseSchema(BaseModel):
        branch_id: int
        dept_id: int

    class CreateInput(BaseSchema):
        pass

    class Dept(BaseModel):
        id: int
        name: str

    class Doctor(BaseModel):
        id: int
        name: str
        degree: str
        experience: str


@router.get(
    "/branch-depts",
    response_model=list[BranchDeptSchema.Dept],
    status_code=status.HTTP_200_OK,
)
async def get_branch_depts(branch_id: int):
    return await BranchDeptService.get_branch_depts(branch_id)


@router.post(
    "/branch-depts",
    response_model=BranchDeptSchema.BaseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def create_branch_dept(branch_dept: BranchDeptSchema.CreateInput):
    return await BranchDeptService.create_branch_dept(
        branch_dept.branch_id, branch_dept.dept_id
    )


@router.get(
    "/branch-depts/doctors",
    response_model=list[BranchDeptSchema.Doctor],
    status_code=status.HTTP_200_OK,
)
async def get_branch_depts(branch_id: int, dept_id: int):
    return await BranchDeptService.get_branch_dept_doctors(branch_id, dept_id)
