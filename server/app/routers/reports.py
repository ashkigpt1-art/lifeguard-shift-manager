import csv
import io
from datetime import datetime

from fastapi import APIRouter, Depends, Response
from sqlmodel import Session, select

from ..auth import require_role
from ..database import get_session
from ..models import Role, ShiftAssignment, User, Shift


router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/assignments.csv")
def export_assignments(
    session: Session = Depends(get_session),
    _: User = Depends(require_role([Role.ADMIN, Role.MANAGER])),
    start: datetime | None = None,
    end: datetime | None = None,
):
    statement = select(ShiftAssignment)
    if start:
        statement = statement.where(ShiftAssignment.shift.has(Shift.starts_at >= start))
    if end:
        statement = statement.where(ShiftAssignment.shift.has(Shift.ends_at <= end))

    assignments = session.exec(statement).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "Assignment ID",
        "Shift",
        "Location",
        "Start",
        "End",
        "Employee",
        "Task",
        "Note",
        "Check In",
        "Check Out",
    ])

    for assignment in assignments:
        shift = assignment.shift
        employee = assignment.employee
        task = assignment.task
        writer.writerow(
            [
                assignment.id,
                shift.name if shift else "",
                shift.location if shift else "",
                shift.starts_at.isoformat() if shift else "",
                shift.ends_at.isoformat() if shift else "",
                f"{employee.first_name} {employee.last_name}" if employee else "",
                task.name if task else "",
                assignment.note or "",
                assignment.check_in_time.isoformat() if assignment.check_in_time else "",
                assignment.check_out_time.isoformat() if assignment.check_out_time else "",
            ]
        )

    return Response(
        content=buffer.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=assignments.csv"},
    )
