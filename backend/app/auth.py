from fastapi import Header, HTTPException, status
from sqlalchemy.future import select

from app.db import session
from app.models import Role, UserRole

ADMIN_ROLE_NAME = "admin"


async def is_user_admin(user_id: int) -> bool:
    result = await session().execute(
        select(Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id, Role.name == ADMIN_ROLE_NAME)
    )
    return result.scalar_one_or_none() is not None


async def require_admin(x_user_id: int | None = Header(default=None, alias="X-User-Id")):
    if x_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-User-Id header.",
        )
    if not await is_user_admin(x_user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required.",
        )
