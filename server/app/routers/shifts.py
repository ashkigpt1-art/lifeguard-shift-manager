from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from ..auth import require_role
from ..database import get_session
from ..models import Role, Shift, ShiftCreate, ShiftRead, User


router = APIRouter(prefix="/shifts", tags=["shifts"])


@router.get("", response_model=list[ShiftRead])
def list_shifts(
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER, Role.VIEWER])),
    start: datetime | None = Query(default=None),
    end: datetime | None = Query(default=None),
):
    statement = select(Shift)
    if start:
        statement = statement.where(Shift.starts_at >= start)
    if end:
        statement = statement.where(Shift.ends_at <= end)
    statement = statement.order_by(Shift.starts_at)
    return session.exec(statement).all()


@router.post("", response_model=ShiftRead, status_code=status.HTTP_201_CREATED)
def create_shift(
    payload: ShiftCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    shift = Shift.model_validate(payload)
    session.add(shift)
    session.commit()
    session.refresh(shift)
    return shift


@router.put("/{shift_id}", response_model=ShiftRead)
def update_shift(
    shift_id: int,
    payload: ShiftCreate,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
):
    shift = session.get(Shift, shift_id)
    if not shift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shift not found")
    for key, value in payload.model_dump().items():
        setattr(shift, key, value)
    session.add(shift)
    session.commit()
    session.refresh(shift)
    return shift


@router.delete("/{shift_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shift(
    shift_id: int,
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN])),
):
    shift = session.get(Shift, shift_id)
    if not shift:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shift not found")
    session.delete(shift)
    session.commit()
