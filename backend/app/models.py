import enum
import datetime
from typing import List
from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column

from .db import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50) ,unique=True, nullable=False)


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)


class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    branches: Mapped[List["Branch"]] = relationship(back_populates="hospital")


class GenderEnum(enum.Enum):
    male = 1
    female = 2


class BloodGroupEnum(enum.Enum):
    A_POS = 1
    A_NEG = 2
    B_POS = 3
    B_NEG = 4
    O_POS = 5
    O_NEG = 6
    AB_POS = 7
    AB_NEG = 8


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_name: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    password:Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    dob: Mapped[datetime.date] = mapped_column(Date)
    gender: Mapped[GenderEnum] = mapped_column(Enum(GenderEnum))
    blood_group: Mapped[BloodGroupEnum] = mapped_column(Enum(BloodGroupEnum))


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True)
    address = Column(String(300), nullable=False)
    email = Column(String(30), nullable=False)
    phone = Column(String(20), nullable=False)

    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id"))
    hospital: Mapped["Hospital"] = relationship(back_populates="branches")
