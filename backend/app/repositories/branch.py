from sqlalchemy.future import select

from app.db import session
from app.models import Branch


class BranchRepo:
    @staticmethod
    async def get_branches(hospital_id: int | None = None):
        if hospital_id:
            results = await session().execute(
                select(Branch).where(Branch.hospital_id == hospital_id)
            )
        else:
            results = await session().execute(select(Branch))

        branches = results.scalars().all()
        return [
            {
                "id": branch.id,
                "hospital_id": branch.hospital_id,
                "address": branch.address,
                "phone": branch.phone,
                "email": branch.email,
            }
            for branch in branches
        ]

    @staticmethod
    async def get_branch(branch_id: int):
        branch = await session().get(Branch, branch_id)
        if branch is None:
            return None
        return {
            "id": branch.id,
            "hospital_id": branch.hospital_id,
            "address": branch.address,
            "phone": branch.phone,
            "email": branch.email,
        }

    @staticmethod
    async def create_branch(hospital_id: int, address: str, phone: str, email: str):
        new_branch = Branch(
            hospital_id=hospital_id, address=address, phone=phone, email=email
        )
        session().add(new_branch)
        await session().commit()
        await session().refresh(new_branch)
        return new_branch
