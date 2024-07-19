import datetime

from app.repositories.work_place import WorkPlaceRepo


class WorkPlaceService:
    @staticmethod
    async def get_work_places(employee_id: int):
        return await WorkPlaceRepo.get_work_places(employee_id)

    @staticmethod
    async def create_work_place(
        branch_id: int,
        employee_id: int,
        start_date: datetime.date,
        end_date: datetime.date | None,
    ):
        return await WorkPlaceRepo.create_work_place(
            branch_id, employee_id, start_date, end_date
        )
