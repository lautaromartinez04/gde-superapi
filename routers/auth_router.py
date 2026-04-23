from fastapi import APIRouter, Depends, Request
from middlewares.jwt_bearer import JWTBearer

router = APIRouter(tags=["Auth"])

@router.get("/me")
async def get_current_user_info(request: Request, payload: dict = Depends(JWTBearer())):
    """
    Verifica la cookie/token y devuelve la información del usuario logueado.
    Sirve para que el AuthContext del frontend sepa que la sesión es válida.
    """
    # El payload ya trae los datos validados del token (incluyendo el JIT-synced usuario)
    return {
        "id": payload.get("usuario_id") or payload.get("uid"),
        "usuario": payload.get("usuario", "Unknown"),
        "email": payload.get("email", ""),
        "nombre_completo": payload.get("nombre_completo", ""),
        "rol": payload.get("rol", "user"),
        "permisos": payload.get("permisos", [])
    }
