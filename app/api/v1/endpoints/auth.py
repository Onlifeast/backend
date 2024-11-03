from fastapi import APIRouter, Depends
from app.models.user import User
from app.db.session import async_session
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/login")
async def login():
    return {"message": "Login successful"}

@router.get("/logout")
async def logout():
    return {"message": "Logout successful"}

@router.get("/register")
async def register(user: User, session: AsyncSession = Depends(async_session)):
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

@router.get("/forgot_password")
async def forgot_password():
    return {"message": "Password reset successful"}

@router.get("/reset_password")
async def reset_password():
    return {"message": "Password reset successful"}

@router.get("/verify_email")
async def verify_email():
    return {"message": "Email verified successfully"}

@router.get("/resend_verification_email")
async def resend_verification_email():
    return {"message": "Verification email resent successfully"}
