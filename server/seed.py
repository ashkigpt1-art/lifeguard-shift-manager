"""Database seeding utilities for the Wavepark Shift Manager API."""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Iterable

from sqlmodel import select


CURRENT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = CURRENT_DIR.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from server.app.database import init_db, session_scope  # noqa: E402
from server.app.models import Employee, Role, User  # noqa: E402


ADMIN_EMAIL = "admin@example.com"
ADMIN_FULL_NAME = "Wavepark Admin"
ADMIN_HASHED_PASSWORD = "$2b$12$.xc0U.Xowp74BLoPNelwh.rXx6/64omoCS0FI47N4S/t1S/k9YRLS"

LIFEGUARDS: list[dict[str, str | None]] = [
    {
        "first_name": "Avery",
        "last_name": "Brooks",
        "position": "Head Lifeguard",
        "phone": "555-0101",
        "notes": "experience: expert | role: head",
    },
    {
        "first_name": "Jordan",
        "last_name": "Nguyen",
        "position": "Rescue Specialist",
        "phone": "555-0102",
        "notes": "experience: expert | role: rescue",
    },
    {
        "first_name": "Maya",
        "last_name": "Lopez",
        "position": "Safety Checker",
        "phone": "555-0103",
        "notes": "experience: medium | role: check",
    },
    {
        "first_name": "Liam",
        "last_name": "Harper",
        "position": "Support Crew",
        "phone": "555-0104",
        "notes": "experience: medium | role: support",
    },
    {
        "first_name": "Nora",
        "last_name": "Kim",
        "position": "Part-time Lifeguard",
        "phone": "555-0105",
        "notes": "experience: easy | role: parttime",
    },
    {
        "first_name": "Eli",
        "last_name": "Sanchez",
        "position": "Rescue Trainee",
        "phone": "555-0106",
        "notes": "experience: easy | role: rescue",
    },
    {
        "first_name": "Priya",
        "last_name": "Patel",
        "position": "Support Crew",
        "phone": "555-0107",
        "notes": "experience: medium | role: support",
    },
    {
        "first_name": "Kai",
        "last_name": "Morgan",
        "position": "Safety Checker",
        "phone": "555-0108",
        "notes": "experience: expert | role: check",
    },
]


def ensure_admin_user(session) -> User:
    """Create or update the default admin user."""

    admin = session.exec(select(User).where(User.email == ADMIN_EMAIL)).first()
    if admin is None:
        admin = User(
            email=ADMIN_EMAIL,
            full_name=ADMIN_FULL_NAME,
            role=Role.ADMIN,
            hashed_password=ADMIN_HASHED_PASSWORD,
        )
        session.add(admin)
        session.commit()
        session.refresh(admin)
        return admin

    updated = False
    if admin.full_name != ADMIN_FULL_NAME:
        admin.full_name = ADMIN_FULL_NAME
        updated = True
    if admin.role != Role.ADMIN:
        admin.role = Role.ADMIN
        updated = True
    if admin.hashed_password != ADMIN_HASHED_PASSWORD:
        admin.hashed_password = ADMIN_HASHED_PASSWORD
        updated = True

    if updated:
        session.add(admin)
        session.commit()
        session.refresh(admin)

    return admin


def ensure_lifeguards(session) -> Iterable[Employee]:
    """Create or update the sample lifeguards."""

    employees: list[Employee] = []
    has_changes = False

    for data in LIFEGUARDS:
        first_name = data["first_name"]
        last_name = data["last_name"]
        existing = session.exec(
            select(Employee).where(
                Employee.first_name == first_name, Employee.last_name == last_name
            )
        ).first()

        if existing is None:
            new_employee = Employee(**data)
            session.add(new_employee)
            employees.append(new_employee)
            has_changes = True
            continue

        updated = False
        for field in ("position", "phone", "notes"):
            value = data.get(field)
            if getattr(existing, field) != value:
                setattr(existing, field, value)
                updated = True

        if updated:
            session.add(existing)
            has_changes = True

        employees.append(existing)

    if has_changes:
        session.commit()
        for employee in employees:
            session.refresh(employee)

    return employees


def main() -> None:
    init_db()
    with session_scope() as session:
        admin = ensure_admin_user(session)
        lifeguards = list(ensure_lifeguards(session))

        print("Admin user:")
        print(f"- {admin.email} ({admin.full_name}) role={admin.role}")
        print("\nLifeguards:")
        for guard in lifeguards:
            print(
                f"- {guard.first_name} {guard.last_name} | {guard.position} | {guard.notes}"
            )


if __name__ == "__main__":
    main()
