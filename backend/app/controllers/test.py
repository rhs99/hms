from fastapi import APIRouter, status
from pydantic import BaseModel

from app.services.test import TestService

router = APIRouter()


class TestSchema:
    class TestCreateInput(BaseModel):
        name: str

    class Output(BaseModel):
        id: int
        name: str


@router.get(
    "/tests",
    response_model=list[TestSchema.Output],
    status_code=status.HTTP_200_OK,
)
async def get_tests():
    return await TestService.get_tests()


@router.post(
    "/tests",
    response_model=TestSchema.Output,
    status_code=status.HTTP_201_CREATED,
)
async def create_role(test: TestSchema.TestCreateInput):
    return await TestService.create_test(test.name)
