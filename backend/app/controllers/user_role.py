from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from app.auth import require_admin
from app.services.user_role import UserRoleService

router = APIRouter()


class UserRoleSchema:
    class BaseSchema(BaseModel):
        user_id: int
        role_id: int

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        pass


@router.post(
    "/user-roles",
    response_model=UserRoleSchema.Output,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin)],
)
async def create_user_role(user_role: UserRoleSchema.CreateInput):
    return await UserRoleService.create_user_role(user_role.user_id, user_role.role_id)


@router.get(
    "/user-roles/{user_role_id}",
    response_model=UserRoleSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_user_role(user_role_id: int):
    return await UserRoleService.get_user_role(user_role_id)


@router.get(
    "/user-roles",
    response_model=list[UserRoleSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_user_roles(user_id: int):
    return await UserRoleService.get_user_roles(user_id)
