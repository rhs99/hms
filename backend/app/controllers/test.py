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
async def create_role(test: TestSchema.CreateInput):
    return await TestService.create_test(test.name)
