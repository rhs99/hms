import datetime

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.future import select

from app.config import Config
from app.db import session
from app.models import Role, UserRole

ADMIN_ROLE_NAME = "admin"

_bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(plaintext: str) -> str:
    return bcrypt.hashpw(plaintext.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plaintext: str, stored: str) -> bool:
    try:
        return bcrypt.checkpw(plaintext.encode("utf-8"), stored.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(user_id: int, is_admin: bool) -> str:
    now = datetime.datetime.now(datetime.timezone.utc)
    payload = {
        "sub": str(user_id),
        "is_admin": is_admin,
        "iat": int(now.timestamp()),
        "exp": int(
            (now + datetime.timedelta(hours=Config.JWT_EXPIRES_HOURS)).timestamp()
        ),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)


def _decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            Config.JWT_SECRET,
            algorithms=[Config.JWT_ALGORITHM],
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token."
        )


async def current_user_id(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> int:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )
    payload = _decode_token(creds.credentials)
    try:
        return int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token."
        )


async def is_user_admin(user_id: int) -> bool:
    result = await session().execute(
        select(Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id, Role.name == ADMIN_ROLE_NAME)
    )
    return result.scalar_one_or_none() is not None


async def require_admin(user_id: int = Depends(current_user_id)) -> int:
    if not await is_user_admin(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin role required.",
        )
    return user_id
