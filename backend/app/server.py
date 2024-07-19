from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import DBAPIError

from app.db import session_factory, session_var
from app.controllers.branch import router as branch_router
from app.controllers.branch_dept import router as branch_dept_router
from app.controllers.department import router as department_router
from app.controllers.doctor import router as doctor_router
from app.controllers.hospital import router as hospital_router
from app.controllers.role import router as role_router
from app.controllers.slot import router as slot_router
from app.controllers.slot_schedule import router as slot_schedule_router
from app.controllers.test import router as test_router
from app.controllers.user import router as user_router
from app.controllers.user_role import router as user_role_router
from app.controllers.work_place import router as work_place_router

app = FastAPI()

app.include_router(branch_router, tags=["branch"])
app.include_router(branch_dept_router, tags=["branch-dept"])
app.include_router(department_router, tags=["department"])
app.include_router(doctor_router, tags=["doctor"])
app.include_router(hospital_router, tags=["hospital"])
app.include_router(role_router, tags=["role"])
app.include_router(slot_router, tags=["slot"])
app.include_router(slot_schedule_router, tags=["slot-schedule"])
app.include_router(test_router, tags=["test"])
app.include_router(user_router, tags=["user"])
app.include_router(user_role_router, tags=["user-role"])
app.include_router(work_place_router, tags=["work-place"])


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    async with session_factory() as session:
        session_var.set(session)
        response = await call_next(request)
        try:
            await session.commit()
        except DBAPIError as e:
            await session.rollback()
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"message": "Internal Server Error"},
            )
    return response
