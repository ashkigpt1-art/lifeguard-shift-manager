from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SHIFT_MANAGER_", env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./lifeguard.db"
    secret_key: str = "super-secret-key"
    access_token_expire_minutes: int = 60 * 12  # 12 hours
    algorithm: str = "HS256"
    default_admin_email: str = "admin@wavepark.local"
    default_admin_password: str = "ChangeMe123!"


@lru_cache
def get_settings() -> Settings:
    return Settings()
