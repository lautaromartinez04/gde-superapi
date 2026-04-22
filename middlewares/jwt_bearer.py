from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException
from utils.jwt_manager import validate_token
from database import SessionLocal
from models.usuarios import Usuarios

class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        # 1. Obtener token de Cookie (Portal) o Header (API directo)
        token = request.cookies.get("dem_access_token")
        if not token:
            auth = await super().__call__(request)
            token = auth.credentials if auth else None
                
        if not token:
            raise HTTPException(status_code=401, detail="No autenticado")

        # 2. Validar Token contra la clave compartida
        try:
            payload = validate_token(token)
        except Exception:
            raise HTTPException(status_code=401, detail="Token inválido")
            
        # 3. Sincronización Just-In-Time (JIT)
        usuario_id = payload.get("usuario_id") or payload.get("uid")
        if usuario_id:
            db = SessionLocal()
            try:
                # Mapeo de datos del token
                nombre_completo = payload.get("nombre_completo", "Usuario")
                partes = nombre_completo.split(" ", 1)
                nombre = partes[0]
                apellido = partes[1] if len(partes) > 1 else ""

                user = db.query(Usuarios).filter(Usuarios.id == usuario_id).first()
                if not user:
                    # CREAR NUEVO USUARIO
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
                    # ACTUALIZAR EXISTENTE
                    user.nombre = nombre
                    user.apellido = apellido
                    user.role = payload.get("rol", user.role)
                db.commit()
            finally:
                db.close()
        
        request.state.jwt_payload = payload
        return payload
