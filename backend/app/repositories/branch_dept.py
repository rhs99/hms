from sqlalchemy.future import select

from app.db import session
from app.models import BranchDept, Department


class BranchDeptRepo:
    @staticmethod
    async def get_branch_depts(branch_id: int):
        results = await session().execute(select(Department.name).filter(Department.id == BranchDept.dept_id).where(BranchDept.branch_id == branch_id))
        depts = [res for res in results.all()]
        return [{'name': dept[0]} for dept in depts]

    @staticmethod
    async def create_branch_dept(branch_id: int, dept_id: int):
        new_branch_dept = BranchDept(branch_id=branch_id, dept_id=dept_id)
        session().add(new_branch_dept)
        await session().commit()
        await session().refresh(new_branch_dept)
        return new_branch_dept
