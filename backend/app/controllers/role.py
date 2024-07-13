from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.role import RoleService

router = APIRouter()


class RoleSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


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
async def create_role(role: RoleSchema.CreateInput):
    return await RoleService.create_role(role.name)
