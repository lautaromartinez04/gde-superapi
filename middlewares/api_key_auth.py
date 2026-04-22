from fastapi import Header, HTTPException, status
import os

API_KEY = os.getenv("API_KEY", "<Donemilio@2026>")

async def verify_api_key(x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate API Key"
        )
    return x_api_key
