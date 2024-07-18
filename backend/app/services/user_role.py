from app.repositories.user_role import UserRoleRepo


class RoleService:
    @staticmethod
    async def get_user_roles(user_id: int):
        return await UserRoleRepo.get_user_roles(user_id)

    @staticmethod
    async def create_user_role(user_id: int, role_id: int):
        return await UserRoleRepo.create_user_role(user_id, role_id)
