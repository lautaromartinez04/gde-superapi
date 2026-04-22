from database import Base
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
