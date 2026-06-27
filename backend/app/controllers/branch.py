from fastapi import APIRouter, Query, status
from pydantic import BaseModel

from app.services.branch import BranchService

router = APIRouter()


class _NamedRef(BaseModel):
    id: int
    name: str


class BranchSchema:
    class CreateInput(BaseModel):
        hospital_id: int
        address: str
        phone: str
        email: str
        thana_id: int | None = None

    class Output(BaseModel):
        id: int
        hospital_id: int
        address: str
        phone: str
        email: str
        hospital: _NamedRef | None = None
        thana_id: int | None = None
        thana: _NamedRef | None = None
        district: _NamedRef | None = None
        division: _NamedRef | None = None

    class Page(BaseModel):
        items: list["BranchSchema.Output"]
        total: int
        limit: int
        offset: int


BranchSchema.Page.model_rebuild()


@router.post(
    "/branches",
    response_model=BranchSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_branch(branch: BranchSchema.CreateInput):
    created = await BranchService.create_branch(
        branch.hospital_id,
        branch.address,
        branch.phone,
        branch.email,
        branch.thana_id,
    )
    # Re-fetch so the response includes the joined hospital/thana/etc.
    return await BranchService.get_branch(created.id)


@router.get(
    "/branches/{branch_id}",
    response_model=BranchSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_branch(branch_id: int):
    return await BranchService.get_branch(branch_id)


@router.get(
    "/branches",
    response_model=BranchSchema.Page,
    status_code=status.HTTP_200_OK,
)
async def get_branches(
    hospital_id: int | None = None,
    thana_id: int | None = None,
    district_id: int | None = None,
    division_id: int | None = None,
    search: str | None = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    return await BranchService.get_branches(
        hospital_id=hospital_id,
        thana_id=thana_id,
        district_id=district_id,
        division_id=division_id,
        search=search,
        limit=limit,
        offset=offset,
    )
