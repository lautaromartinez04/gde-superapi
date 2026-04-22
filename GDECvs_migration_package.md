# Integración de SSO y Sincronización JIT en GDECvs

Este documento contiene la lógica necesaria para integrar una aplicación FastAPI (CVS) con el sistema de identidad centralizado (**GDEIdentity**) y el Portal.

## 1. El Concepto: JIT Provisioning
En lugar de crear usuarios manualmente, la aplicación utiliza un **Middleware** que:
1. Valida el token JWT que el usuario trae del Portal.
2. Si el usuario no existe en la base de datos local de CVS, **lo crea en el momento** con los datos del token.
3. Si ya existe, actualiza su nombre, correo y rol para que coincidan con la base central.

---

## 2. Archivos a Integrar

### A. Modelo de Usuario (`models/usuarios.py`)
Define la estructura de la tabla en el esquema `cvs`. La contraseña se guarda como `"sso"` ya que la validación es externa.

```python
from config.database import Base
from sqlalchemy import Column, Integer, String, UniqueConstraint

class Usuarios(Base):
    __tablename__ = "usuarios"
    __table_args__ = (
        UniqueConstraint("correo", name="uq_usuarios_correo"),
        {"schema": "cvs"},  # IMPORTANTE: Esquema cvs en el servidor PYL
    )

    id       = Column(Integer, primary_key=True, index=True)
    apellido = Column(String(50), nullable=False)
    nombre   = Column(String(50), nullable=False)
    correo   = Column(String(120), nullable=False, index=True)
    password = Column(String(255), nullable=False) # Valor por defecto: "sso"
    role     = Column(String(50), nullable=False, default="user")
```

### B. Middleware de Sincronización (`middlewares/jwt_bearer.py`)
Este es el motor de la integración. Debe colocarse en la cadena de dependencias de las rutas protegidas.

```python
from fastapi.security import HTTPBearer
from fastapi import Request, HTTPException
from utils.jwt_manager import validate_token
from config.database import SessionLocal
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
```

### C. Gestor de Tokens (`utils/jwt_manager.py`)
Utilidad simple para decodificar JWT usando PyJWT.

```python
import os
import jwt
from jwt.exceptions import PyJWTError

SECRET_KEY = os.getenv("DEM_PORTAL_SECRET") # Debe ser la misma en Identity y CVS
ALGO = "HS256"

def validate_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
    except PyJWTError as e:
        raise ValueError(str(e))
```

### D. Integrando en `main.py`
Es vital configurar los CORS para que el Portal pueda embeber la aplicación sin errores de seguridad.

```python
from fastapi.middleware.cors import CORSMiddleware
# ... otros imports ...

ALLOWED_ORIGINS = [
    "https://portal.grupodonemilio.com",
    "http://192.168.1.10:8080", # IP del Portal
    # ... otras IPs de confianza ...
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 3. Configuración del Entorno (`.env`)

El creador debe añadir estas variables a su archivo `.env` para que todo conecte:

```bash
# Servidor SQL (PYL) apuntando al esquema cvs
CVS_DB_URL=mssql+pyodbc://usuario:password@servidor/PYL?driver=ODBC+Driver+17+for+SQL+Server

# Clave maestra compartida (Idéntica a la de GDEIdentity)
DEM_PORTAL_SECRET=tu_clave_secreta_aqui
```
