import os


class Config:
    DB_URL = "mysql+aiomysql://root:zxc90zxc@db:3306/hms-db?charset=utf8mb4"
    JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-me")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRES_HOURS = int(os.environ.get("JWT_EXPIRES_HOURS", "24"))
