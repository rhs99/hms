"""Idempotently create the admin role, an admin user, and link them.

Run from the backend container:

    docker compose exec backend python -m scripts.seed_admin

Override defaults via env vars:
    ADMIN_USERNAME  (default: admin)
    ADMIN_PASSWORD  (default: admin)
    ADMIN_EMAIL     (default: admin@hms.local)
    ADMIN_PHONE     (default: 0000000000)
    ADMIN_FULL_NAME (default: Administrator)

Safe to run any number of times — each insert is guarded by a SELECT.
"""

import asyncio
import datetime
import os

from sqlalchemy.future import select

from app.auth import ADMIN_ROLE_NAME, hash_password
from app.db import engine, session_factory, session_var
from app.models import GenderEnum, Role, User, UserRole


async def _ensure_role(name: str) -> Role:
    session = session_var.get()
    role = (
        await session.execute(select(Role).where(Role.name == name))
    ).scalar_one_or_none()
    if role is None:
        role = Role(name=name)
        session.add(role)
        await session.flush()
        print(f"Created role: {name} (id={role.id})")
    else:
        print(f"Role already exists: {name} (id={role.id})")
    return role


async def _ensure_user(
    user_name: str,
    password: str,
    full_name: str,
    email: str,
    phone: str,
) -> User:
    session = session_var.get()
    user = (
        await session.execute(select(User).where(User.user_name == user_name))
    ).scalar_one_or_none()
    if user is None:
        user = User(
            user_name=user_name,
            password=hash_password(password),
            full_name=full_name,
            email=email,
            phone=phone,
            dob=datetime.date(1990, 1, 1),
            gender=GenderEnum.Male,
        )
        session.add(user)
        await session.flush()
        print(f"Created user: {user_name} (id={user.id})")
    else:
        print(f"User already exists: {user_name} (id={user.id})")
    return user


async def _ensure_user_role(user_id: int, role_id: int) -> None:
    session = session_var.get()
    link = (
        await session.execute(
            select(UserRole).where(
                UserRole.user_id == user_id, UserRole.role_id == role_id
            )
        )
    ).scalar_one_or_none()
    if link is None:
        session.add(UserRole(user_id=user_id, role_id=role_id))
        await session.flush()
        print(f"Linked user {user_id} to role {role_id}")
    else:
        print(f"User {user_id} already has role {role_id}")


async def main() -> None:
    user_name = os.environ.get("ADMIN_USERNAME", "admin")
    password = os.environ.get("ADMIN_PASSWORD", "admin")
    full_name = os.environ.get("ADMIN_FULL_NAME", "Administrator")
    email = os.environ.get("ADMIN_EMAIL", "admin@hms.local")
    phone = os.environ.get("ADMIN_PHONE", "0000000000")

    try:
        async with session_factory() as session:
            session_var.set(session)
            try:
                role = await _ensure_role(ADMIN_ROLE_NAME)
                user = await _ensure_user(user_name, password, full_name, email, phone)
                await _ensure_user_role(user.id, role.id)
                await session.commit()
                print("Done.")
            except Exception:
                await session.rollback()
                raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
