from app.repositories.test import TestRepo


class TestService:
    @staticmethod
    async def get_tests():
        return await TestRepo.get_tests()

    @staticmethod
    async def create_test(name: str):
        return await TestRepo.create_test(name)
