import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine

from server.app.main import app
from server.app import database
from server.app.auth import create_initial_admin


@pytest.fixture(autouse=True)
def setup_db(tmp_path: Path):
    test_db_path = tmp_path / "test.db"
    test_engine = create_engine(f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False})
    database.override_engine(test_engine)
    SQLModel.metadata.create_all(test_engine)
    with database.session_scope() as session:
        create_initial_admin(session)
    yield
    SQLModel.metadata.drop_all(test_engine)


@pytest.fixture()
def client():
    return TestClient(app)
