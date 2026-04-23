from fastapi import Header, HTTPException, status
import os

API_KEY = os.getenv("API_KEY", "<Donemilio@2026>")

async def verify_api_key(x_api_key: str = Header(None)):
    print(f"[DEBUG] Received x-api-key: '{x_api_key}', Expected: '{API_KEY}'")
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Could not validate API Key. Received: {x_api_key}"
        )
    return x_api_key
