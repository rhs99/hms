from app.repositories.branch_dept import BranchDeptRepo


class BranchDeptService:
    @staticmethod
    async def get_branch_depts(branch_id: int):
        return await BranchDeptRepo.get_branch_depts(branch_id)

    @staticmethod
    async def create_branch_dept(branch_id: int, dept_id: int):
        return await BranchDeptRepo.create_branch_dept(branch_id, dept_id)
