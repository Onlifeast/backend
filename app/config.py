import os
from dotenv import load_dotenv

load_dotenv()
# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/ecommerce")