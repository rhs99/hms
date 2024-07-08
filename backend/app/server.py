from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import DBAPIError

from app.db import session_factory, session_var
from app.controllers.department import router as department_router

app = FastAPI()
app.include_router(department_router)

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
