from contextlib import contextmanager

from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.engine import Engine

from .config import get_settings


settings = get_settings()
engine = create_engine(settings.database_url, echo=False)


def override_engine(new_engine: Engine) -> None:
    global engine
    engine = new_engine


def init_db() -> None:
    import server.app.models  # noqa: F401 ensures models registered

    SQLModel.metadata.create_all(engine)


@contextmanager
def session_scope():
    with Session(engine) as session:
        yield session


def get_session():
    with Session(engine) as session:
        yield session
