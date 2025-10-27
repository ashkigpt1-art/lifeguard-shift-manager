from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_session
from ..models import Employee, EmployeeCreate, EmployeeRead, Role, User
from ..auth import require_role


router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeRead])
def list_employees(
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER, Role.VIEWER])),
):
    return session.exec(select(Employee)).all()


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    employee = Employee.model_validate(payload)
    session.add(employee)
    session.commit()
    session.refresh(employee)
    return employee


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(
    employee_id: int,
    payload: EmployeeCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    for key, value in payload.model_dump().items():
        setattr(employee, key, value)
    session.add(employee)
    session.commit()
    session.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN])),
):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    session.delete(employee)
    session.commit()
