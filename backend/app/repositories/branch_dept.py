from sqlalchemy.future import select

from app.db import session
from app.models import BranchDept


class BranchDeptRepo:
    @staticmethod
    async def get_branch_depts(branch_id: int):
        branch_depts = await session().scalars(
            select(BranchDept.branch_id == branch_id)
        )
        return [branch_dept for branch_dept in branch_depts.all()]

    @staticmethod
    async def create_branch_dept(branch_id: int, dept_id: int):
        new_branch_dept = BranchDept(branch_id=branch_id, dept_id=dept_id)
        session().add(new_branch_dept)
        await session().commit()
        await session().refresh(new_branch_dept)
        return new_branch_dept
