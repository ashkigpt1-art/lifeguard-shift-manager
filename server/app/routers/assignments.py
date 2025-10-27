from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..auth import require_role
from ..database import get_session
from ..models import (
    Employee,
    Role,
    Shift,
    ShiftAssignment,
    ShiftAssignmentCreate,
    ShiftAssignmentRead,
    ShiftAssignmentUpdate,
    Task,
    User,
)


router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("", response_model=list[ShiftAssignmentRead])
def list_assignments(
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER, Role.VIEWER])),
):
    assignments = session.exec(select(ShiftAssignment)).all()
    return [
        ShiftAssignmentRead(
            id=item.id,
            shift=item.shift,
            employee=item.employee,
            task=item.task,
            shift_id=item.shift_id,
            employee_id=item.employee_id,
            task_id=item.task_id,
            note=item.note,
            check_in_time=item.check_in_time,
            check_out_time=item.check_out_time,
        )
        for item in assignments
    ]


@router.post("", response_model=ShiftAssignmentRead, status_code=status.HTTP_201_CREATED)
def create_assignment(
    payload: ShiftAssignmentCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    shift = session.get(Shift, payload.shift_id)
    employee = session.get(Employee, payload.employee_id)
    if not shift or not employee:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Shift or employee not found")

    task = session.get(Task, payload.task_id) if payload.task_id else None
    assignment = ShiftAssignment.model_validate(payload)
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return ShiftAssignmentRead(
        id=assignment.id,
        shift=shift,
        employee=employee,
        task=task,
        shift_id=assignment.shift_id,
        employee_id=assignment.employee_id,
        task_id=assignment.task_id,
        note=assignment.note,
        check_in_time=assignment.check_in_time,
        check_out_time=assignment.check_out_time,
    )


@router.patch("/{assignment_id}", response_model=ShiftAssignmentRead)
def update_assignment(
    assignment_id: int,
    payload: ShiftAssignmentUpdate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    assignment = session.get(ShiftAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found")

    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(assignment, key, value)
    session.add(assignment)
    session.commit()
    session.refresh(assignment)
    return ShiftAssignmentRead(
        id=assignment.id,
        shift=assignment.shift,
        employee=assignment.employee,
        task=assignment.task,
        shift_id=assignment.shift_id,
        employee_id=assignment.employee_id,
        task_id=assignment.task_id,
        note=assignment.note,
        check_in_time=assignment.check_in_time,
        check_out_time=assignment.check_out_time,
    )


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    assignment = session.get(ShiftAssignment, assignment_id)
    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found")
    session.delete(assignment)
    session.commit()
