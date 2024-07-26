from fastapi import APIRouter, status
from pydantic import BaseModel

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


@router.get(
    "/user-roles",
    response_model=list[UserRoleSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_user_roles(user_id: int):
    return await UserRoleService.get_user_roles(user_id)


@router.post(
    "/user-roles",
    response_model=UserRoleSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_user_role(user_role: UserRoleSchema.CreateInput):
    return await UserRoleService.create_user_role(user_role.user_id, user_role.role_id)
