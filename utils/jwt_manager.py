import os
import jwt
from jwt.exceptions import PyJWTError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("DEM_PORTAL_SECRET", "default_secret_key_change_me")
ALGO = "HS256"

def validate_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
    except PyJWTError as e:
        raise ValueError(str(e))
