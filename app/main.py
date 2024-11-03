from fastapi import FastAPI
from app.api.v1.endpoints import api_router
from app.db.session import init_db

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(api_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    await init_db()