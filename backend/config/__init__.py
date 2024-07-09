import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()
class CommonSettings(BaseSettings):
    APP_NAME: str = "ShapeShift"
    DEBUG_MODE: bool = False
    API_V1_STR: str = "/api/v1"
class AuthSettings(BaseSettings):
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
    JWT_REFRESH_SECRET_KEY: str = os.getenv("JWT_REFRESH_SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

class ServerSettings(BaseSettings):
    HOST: str = os.getenv("HOST")
    PORT: int = os.getenv("PORT")

class DatabaseSettings(BaseSettings):
    usr: str = os.getenv("USR")
    pw: str = os.getenv("PW")
    DB_URL: str = f"mongodb+srv://{usr}:{pw}@cluster0.wfq6k8m.mongodb.net/?retryWrites=true&w=majority"
    DB_NAME: str = "test"

class Settings(CommonSettings, AuthSettings, ServerSettings, DatabaseSettings):
    pass

settings = Settings()