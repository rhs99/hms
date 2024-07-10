from app.repositories.department import DepartmentRepo


class DepartmentService:
    @staticmethod
    async def get_departments():
        return await DepartmentRepo.get_departments()

    @staticmethod
    async def create_department(name: str):
        return await DepartmentRepo.create_department(name)
