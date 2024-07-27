import datetime
from sqlalchemy.future import select

from app.db import session
from app.models import WorkPlace, Slot, SlotSchedule, Hospital, Branch


class WorkPlaceRepo:
    @staticmethod
    async def get_work_places(employee_id: int):
        results = await session().execute(
            select(SlotSchedule.id, Hospital.name, Branch.address, SlotSchedule.day, Slot.start_at, Slot.end_at)
            .filter(WorkPlace.employee_id == employee_id)
            .filter(WorkPlace.end_date == None)
            .filter(WorkPlace.branch_id == Branch.id)
            .filter(Branch.hospital_id == Hospital.id)
            .filter(WorkPlace.id == SlotSchedule.work_place_id)
            .filter(SlotSchedule.slot_id == Slot.id)
        )
        work_places = [res for res in results.all()]
        return [
            {
                "slot_schedule_id": work_place[0],
                "hospital": work_place[1],
                "branch": work_place[2],
                "day": work_place[3],
                "start_at": work_place[4],
                "end_at": work_place[5],
            }
            for work_place in work_places
        ]

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
