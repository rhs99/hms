from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.branch import BranchService

router = APIRouter()


class BranchSchema:
    class BaseSchema(BaseModel):
        hospital_id: int
        address: str
        phone: str
        email: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.get(
    "/branches",
    response_model=list[BranchSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_branches(hospital_id: int | None = None):
    return await BranchService.get_branches(hospital_id)


@router.post(
    "/branches",
    response_model=BranchSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_role(branch: BranchSchema.CreateInput):
    return await BranchService.create_branch(
        branch.hospital_id, branch.address, branch.phone, branch.email
    )
