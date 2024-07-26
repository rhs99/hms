import datetime
from sqlalchemy.future import select

from app.db import session
from app.models import WorkPlace


class WorkPlaceRepo:
    @staticmethod
    async def get_work_places(employee_id: int):
        work_places = await session().scalars(
            select(WorkPlace).filter(WorkPlace.employee_id == employee_id)
        )
        return [work_place for work_place in work_places.all()]

    @staticmethod
    async def create_work_place(
        branch_id: int,
        employee_id: int,
        start_date: datetime.date,
        end_date: datetime.date | None,
    ):
        new_work_place = WorkPlace(
            branch_id=branch_id,
            employee_id=employee_id,
            start_date=start_date,
            end_date=end_date,
        )
        session().add(new_work_place)
        await session().commit()
        await session().refresh(new_work_place)
        return new_work_place
