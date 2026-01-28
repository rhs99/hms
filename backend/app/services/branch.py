from app.repositories.branch import BranchRepo


class BranchService:
    @staticmethod
    async def get_branches(hospital_id: int | None = None):
        return await BranchRepo.get_branches(hospital_id)

    @staticmethod
    async def get_branch(branch_id: int):
        return await BranchRepo.get_branch(branch_id)

    @staticmethod
    async def create_branch(hospital_id: int, address: str, phone: str, email: str):
        return await BranchRepo.create_branch(hospital_id, address, phone, email)
