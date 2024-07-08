from fastapi import APIRouter
from sqlalchemy.future import select
from pydantic import BaseModel

from app.db import session
from app.models import Department

router = APIRouter()


class DepartmentSchema(BaseModel):
    name: str


@router.get("/departments", status_code=200)
async def get_departments():
    departments = await session().scalars(select(Department))
    return [dept for dept in departments.all()]

@router.post("/departments", status_code=201)
async def create_department(dept: DepartmentSchema):
    new_dept = Department(name=dept.name)
    session().add(new_dept)
    await session().commit()
