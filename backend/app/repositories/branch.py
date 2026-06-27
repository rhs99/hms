from sqlalchemy import func, or_
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db import session
from app.models import Branch, District, Hospital, Thana


def _serialize(branch: Branch) -> dict:
    thana = branch.thana
    district = thana.district if thana is not None else None
    division = district.division if district is not None else None
    return {
        "id": branch.id,
        "address": branch.address,
        "email": branch.email,
        "phone": branch.phone,
        "hospital_id": branch.hospital_id,
        "hospital": (
            {"id": branch.hospital.id, "name": branch.hospital.name}
            if branch.hospital is not None
            else None
        ),
        "thana_id": branch.thana_id,
        "thana": ({"id": thana.id, "name": thana.name} if thana is not None else None),
        "district": (
            {"id": district.id, "name": district.name} if district is not None else None
        ),
        "division": (
            {"id": division.id, "name": division.name} if division is not None else None
        ),
    }


def _apply_filters(
    stmt,
    *,
    hospital_id: int | None,
    thana_id: int | None,
    district_id: int | None,
    division_id: int | None,
    search: str | None,
):
    if hospital_id is not None:
        stmt = stmt.where(Branch.hospital_id == hospital_id)
    if thana_id is not None:
        stmt = stmt.where(Branch.thana_id == thana_id)
    if district_id is not None:
        thana_ids = select(Thana.id).where(Thana.district_id == district_id)
        stmt = stmt.where(Branch.thana_id.in_(thana_ids))
    if division_id is not None:
        thana_ids = (
            select(Thana.id)
            .join(District, Thana.district_id == District.id)
            .where(District.division_id == division_id)
        )
        stmt = stmt.where(Branch.thana_id.in_(thana_ids))
    if search:
        like = f"%{search}%"
        stmt = stmt.join(Hospital, Branch.hospital_id == Hospital.id).where(
            or_(Hospital.name.ilike(like), Branch.address.ilike(like))
        )
    return stmt


class BranchRepo:
    @staticmethod
    async def get_branches(
        *,
        hospital_id: int | None = None,
        thana_id: int | None = None,
        district_id: int | None = None,
        division_id: int | None = None,
        search: str | None = None,
        limit: int = 20,
        offset: int = 0,
    ):
        items_stmt = (
            select(Branch)
            .options(
                selectinload(Branch.hospital),
                selectinload(Branch.thana)
                .selectinload(Thana.district)
                .selectinload(District.division),
            )
            .order_by(Branch.id)
        )
        items_stmt = (
            _apply_filters(
                items_stmt,
                hospital_id=hospital_id,
                thana_id=thana_id,
                district_id=district_id,
                division_id=division_id,
                search=search,
            )
            .limit(limit)
            .offset(offset)
        )

        count_stmt = _apply_filters(
            select(func.count(Branch.id)),
            hospital_id=hospital_id,
            thana_id=thana_id,
            district_id=district_id,
            division_id=division_id,
            search=search,
        )

        items_result = await session().execute(items_stmt)
        count_result = await session().execute(count_stmt)

        items = [_serialize(b) for b in items_result.scalars().unique().all()]
        total = count_result.scalar_one()

        return {"items": items, "total": total, "limit": limit, "offset": offset}

    @staticmethod
    async def get_branch(branch_id: int):
        stmt = (
            select(Branch)
            .where(Branch.id == branch_id)
            .options(
                selectinload(Branch.hospital),
                selectinload(Branch.thana)
                .selectinload(Thana.district)
                .selectinload(District.division),
            )
        )
        result = await session().execute(stmt)
        branch = result.scalar_one_or_none()
        if branch is None:
            return None
        return _serialize(branch)

    @staticmethod
    async def create_branch(
        hospital_id: int,
        address: str,
        phone: str,
        email: str,
        thana_id: int | None = None,
    ):
        new_branch = Branch(
            hospital_id=hospital_id,
            address=address,
            phone=phone,
            email=email,
            thana_id=thana_id,
        )
        session().add(new_branch)
        await session().commit()
        await session().refresh(new_branch)
        return new_branch
