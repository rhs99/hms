from app.repositories.branch import BranchRepo


class BranchService:
    @staticmethod
    async def get_branches(
        *,
        hospital_id: int | None = None,
        thana_id: int | None = None,
        district_id: int | None = None,
        division_id: int | None = None,
        search: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ):
        return await BranchRepo.get_branches(
            hospital_id=hospital_id,
            thana_id=thana_id,
            district_id=district_id,
            division_id=division_id,
            search=search,
            limit=limit,
            offset=offset,
        )

    @staticmethod
    async def get_branch(branch_id: int):
        return await BranchRepo.get_branch(branch_id)

    @staticmethod
    async def create_branch(
        hospital_id: int,
        address: str,
        phone: str,
        email: str,
        thana_id: int | None = None,
    ):
        return await BranchRepo.create_branch(
            hospital_id, address, phone, email, thana_id
        )
