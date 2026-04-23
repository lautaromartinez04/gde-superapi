from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException
from utils.jwt_manager import validate_token
from database import SessionLocal
from models.usuarios import Usuarios

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        # 1. Cookie SSO (seteada por DEMPortal backend)
        token = request.cookies.get("dem_access_token")

        # 2. Query param ?token= (links directos o redirects del portal)
        if not token:
            token = request.query_params.get("token")

        # 3. Header Authorization: Bearer <token> (peticiones directas de API / axios)
        if not token:
            try:
                auth = await super().__call__(request)
                token = auth.credentials if auth else None
            except Exception:
                token = None

        if not token:
            raise HTTPException(status_code=401, detail="No autenticado")

        # Validar Token contra la clave compartida (DEM_PORTAL_SECRET)
        try:
            payload = validate_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Token inválido o expirado")

        # Sincronización Just-In-Time (JIT) — crea o actualiza el usuario local
        usuario_id = payload.get("usuario_id") or payload.get("uid")
        if usuario_id:
            db = SessionLocal()
            try:
                nombre_completo = payload.get("nombre_completo") or "Usuario"
                partes = nombre_completo.split(" ", 1)
                nombre = partes[0]
                apellido = partes[1] if len(partes) > 1 else ""

                user = db.query(Usuarios).filter(Usuarios.id == usuario_id).first()
                if not user:
                    user = Usuarios(
                        id=usuario_id,
                        nombre=nombre,
                        apellido=apellido,
                        correo=payload.get("email", f"user{usuario_id}@demportal.local"),
                        password="sso",
                        role=payload.get("rol", "user")
                    )
                    db.add(user)
                else:
                    user.nombre = nombre
                    user.apellido = apellido
                    user.role = payload.get("rol", user.role)
                db.commit()
            finally:
                db.close()

        request.state.jwt_payload = payload
        return payload
