import datetime

from app.repositories.work_place import WorkPlaceRepo


class WorkPlaceService:
    @staticmethod
    async def get_work_places(employee_id: int):
        work_places = await WorkPlaceRepo.get_work_places(employee_id)

        for work_place in work_places:
            work_place["day"] = work_place["day"].name

        return work_places

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
