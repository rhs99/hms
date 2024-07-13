from sqlalchemy.future import select

from app.db import session
from app.models import Test


class TestRepo:
    @staticmethod
    async def get_tests():
        tests = await session().scalars(select(Test))
        return [test for test in tests.all()]

    @staticmethod
    async def create_test(name: str):
        new_test = Test(name=name)
        session().add(new_test)
        await session().commit()
        await session().refresh(new_test)
        return new_test
