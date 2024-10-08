import enum
import datetime
from typing import List
from sqlalchemy import String, Date, Enum, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship, Mapped, mapped_column

from .db import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)

    branches: Mapped[List["Branch"]] = relationship(
        secondary="branchdepts", back_populates="depts"
    )


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True)

    users: Mapped[List["User"]] = relationship(
        secondary="userroles", back_populates="roles"
    )


class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)


class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    branches: Mapped[List["Branch"]] = relationship(back_populates="hospital")


class GenderEnum(enum.Enum):
    Male = 1
    Female = 2


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
    user_name: Mapped[str] = mapped_column(String(30), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    full_name: Mapped[str] = mapped_column(String(30), nullable=True)
    email: Mapped[str] = mapped_column(String(30))
    phone: Mapped[str] = mapped_column(String(20))
    dob: Mapped[datetime.date] = mapped_column(Date)
    gender: Mapped[GenderEnum] = mapped_column(Enum(GenderEnum))
    blood_group: Mapped[BloodGroupEnum] = mapped_column(
        Enum(BloodGroupEnum), nullable=True
    )

    roles: Mapped[List["Role"]] = relationship(
        secondary="userroles", back_populates="users"
    )


class Branch(Base):
    __tablename__ = "branches"

    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(String(300))
    email: Mapped[str] = mapped_column(String(30))
    phone: Mapped[str] = mapped_column(String(20))
    hospital_id: Mapped[int] = mapped_column(ForeignKey("hospitals.id"))
    hospital: Mapped["Hospital"] = relationship(back_populates="branches")

    depts: Mapped[List["Department"]] = relationship(
        secondary="branchdepts", back_populates="branches"
    )


class BranchDept(Base):
    __tablename__ = "branchdepts"

    branch_id: Mapped[int] = mapped_column(ForeignKey("branches.id"), primary_key=True)
    dept_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), primary_key=True)


class UserRole(Base):
    __tablename__ = "userroles"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"), primary_key=True)


class Doctor(Base):
    __tablename__ = "doctors"

    user_id = mapped_column(ForeignKey("users.id"), primary_key=True)
    dept_id = mapped_column(ForeignKey("departments.id"))
    registration_no: Mapped[int] = mapped_column(unique=True)
    degree: Mapped[str] = mapped_column(String(300), nullable=True)
    experience: Mapped[str] = mapped_column(String(500), nullable=True)


class WorkPlace(Base):
    __tablename__ = "workplaces"

    id: Mapped[int] = mapped_column(primary_key=True)
    branch_id: Mapped[int] = mapped_column(ForeignKey("branches.id"))
    employee_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    start_date: Mapped[datetime.date] = mapped_column(Date)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=True)


class Slot(Base):
    __tablename__ = "slots"

    id: Mapped[int] = mapped_column(primary_key=True)
    start_at: Mapped[str] = mapped_column(String(10))
    end_at: Mapped[str] = mapped_column(String(10))


class WeekDayEnum(enum.Enum):
    SAT = 1
    SUN = 2
    MON = 3
    TUE = 4
    WED = 5
    THU = 6
    FRI = 7


class SlotSchedule(Base):
    __tablename__ = "slotschedules"
    __table_args__ = (
        UniqueConstraint("work_place_id", "slot_id", "day", name="u_ix_same_day_slot"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.id"))
    work_place_id: Mapped[int] = mapped_column(ForeignKey("workplaces.id"))
    day: Mapped[WeekDayEnum] = mapped_column(Enum(WeekDayEnum))


class Appointment(Base):
    __tablename__ = "appointments"
    __table_args__ = (
        UniqueConstraint(
            "patient_id", "date", "slot_schedule_id", name="u_ix_same_date_slot"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    slot_schedule_id: Mapped[int] = mapped_column(ForeignKey("slotschedules.id"))
    parent: Mapped[int] = mapped_column(ForeignKey("appointments.id"), nullable=True)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime)
    details: Mapped[str] = mapped_column(String(2000), nullable=True)
    serial_no: Mapped[int] = mapped_column(nullable=True)
