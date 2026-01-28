from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.test import TestService

router = APIRouter()


class TestSchema:
    class BaseSchema(BaseModel):
        name: str

    class CreateInput(BaseSchema):
        pass

    class Output(BaseSchema):
        id: int


@router.post(
    "/tests",
    response_model=TestSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_test(test: TestSchema.CreateInput):
    return await TestService.create_test(test.name)


@router.get(
    "/tests/{test_id}",
    response_model=TestSchema.Output,
    status_code=status.HTTP_200_OK,
)
async def get_test(test_id: int):
    return await TestService.get_test(test_id)


@router.get(
    "/tests",
    response_model=list[TestSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_tests():
    return await TestService.get_tests()
