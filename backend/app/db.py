from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import Config
from contextvars import ContextVar

engine = create_async_engine(Config.DB_URL, echo=True)
session_factory = sessionmaker(bind=engine, class_=AsyncSession)
session_var: ContextVar[AsyncSession] = ContextVar("session")
session = session_var.get

Base = declarative_base()
