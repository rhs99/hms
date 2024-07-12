from app.repositories.role import RoleRepo


class RoleService:
    @staticmethod
    async def get_roles():
        return await RoleRepo.get_roles()

    @staticmethod
    async def create_role(name: str):
        return await RoleRepo.create_role(name)
