from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.role import RoleService

router = APIRouter()


class RoleSchema:
    class RoleCreateInput(BaseModel):
        name: str

    class Output(BaseModel):
        id: int
        name: str


@router.get(
    "/roles",
    response_model=list[RoleSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_roles():
    return await RoleService.get_roles()


@router.post(
    "/roles",
    response_model=RoleSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_role(role: RoleSchema.RoleCreateInput):
    return await RoleService.create_role(role.name)
