from sqlalchemy.future import select

from app.db import session
from app.models import Branch


class BranchRepo:
    @staticmethod
    async def get_branches(hospital_id: int | None):
        if not hospital_id:
            return []

        branches = await session().scalars(
            select(Branch).where(Branch.hospital_id == hospital_id)
        )
        return [branch for branch in branches.all()]

    @staticmethod
    async def create_branch(hospital_id: int, address: str, phone: str, email: str):
        new_branch = Branch(
            hospital_id=hospital_id, address=address, phone=phone, email=email
        )
        session().add(new_branch)
        await session().commit()
        await session().refresh(new_branch)
        return new_branch
