from sqlalchemy.future import select

from app.db import session
from app.models import BranchDept, Department, Doctor, WorkPlace, User


class BranchDeptRepo:
    @staticmethod
    async def get_branch_depts(branch_id: int):
        results = await session().execute(
            select(Department.name, Department.id)
            .filter(Department.id == BranchDept.dept_id)
            .where(BranchDept.branch_id == branch_id)
        )
        depts = [res for res in results.all()]
        return [{"name": dept[0], "id": dept[1]} for dept in depts]

    @staticmethod
    async def create_branch_dept(branch_id: int, dept_id: int):
        new_branch_dept = BranchDept(branch_id=branch_id, dept_id=dept_id)
        session().add(new_branch_dept)
        await session().commit()
        await session().refresh(new_branch_dept)
        return new_branch_dept

    @staticmethod
    async def get_branch_dept_doctors(branch_id: int, dept_id: int):
        results = await session().execute(
            select(User.id, User.full_name, Doctor.degree, Doctor.experience)
            .filter(WorkPlace.branch_id == branch_id)
            .filter(Doctor.dept_id == dept_id)
            .filter(Doctor.user_id == WorkPlace.employee_id)
            .filter(User.id == Doctor.user_id)
        )
        doctors = [res for res in results.all()]
        return [
            {
                "id": doctor[0],
                "name": doctor[1],
                "degree": doctor[2],
                "experience": doctor[3],
            }
            for doctor in doctors
        ]
