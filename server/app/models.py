from __future__ import annotations

from datetime import datetime, time
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


class Role(str):
    ADMIN = "admin"
    MANAGER = "manager"
    VIEWER = "viewer"


class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    full_name: str
    role: str = Field(default=Role.MANAGER)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str


class UserRead(UserBase):
    id: int


class UserCreate(UserBase):
    password: str


class EmployeeBase(SQLModel):
    first_name: str
    last_name: str
    position: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None


class Employee(EmployeeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assignments: List["ShiftAssignment"] = Relationship(back_populates="employee")


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: int


class TaskBase(SQLModel):
    name: str
    description: Optional[str] = None
    certification_required: Optional[str] = None


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assignments: List["ShiftAssignment"] = Relationship(back_populates="task")


class TaskCreate(TaskBase):
    pass


class TaskRead(TaskBase):
    id: int


class ShiftBase(SQLModel):
    name: str
    location: str
    starts_at: datetime
    ends_at: datetime
    required_staff: int = 1


class Shift(ShiftBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    assignments: List["ShiftAssignment"] = Relationship(back_populates="shift")


class ShiftCreate(ShiftBase):
    pass


class ShiftRead(ShiftBase):
    id: int


class ShiftAssignmentBase(SQLModel):
    shift_id: int = Field(foreign_key="shift.id")
    employee_id: int = Field(foreign_key="employee.id")
    task_id: Optional[int] = Field(default=None, foreign_key="task.id")
    note: Optional[str] = None
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None


class ShiftAssignment(ShiftAssignmentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    shift: Optional[Shift] = Relationship(back_populates="assignments")
    employee: Optional[Employee] = Relationship(back_populates="assignments")
    task: Optional[Task] = Relationship(back_populates="assignments")


class ShiftAssignmentCreate(ShiftAssignmentBase):
    pass


class ShiftAssignmentRead(ShiftAssignmentBase):
    id: int
    shift: ShiftRead
    employee: EmployeeRead
    task: Optional[TaskRead] = None


class ShiftAssignmentUpdate(SQLModel):
    shift_id: Optional[int] = None
    employee_id: Optional[int] = None
    task_id: Optional[int] = None
    note: Optional[str] = None
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
