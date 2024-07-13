from sqlalchemy import Column, Integer, String

from .db import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    name = Column(String(20), unique=True, nullable=False)


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address = Column(String(500), nullable=False)
    phone = Column(String(15))
    email = Column(String(30))

