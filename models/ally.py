from sqlalchemy import Column, Integer, String
from database import Base

class Ally(Base):
    __tablename__ = "allies"
    __table_args__ = {"schema": "wde"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    image_url = Column(String(255), nullable=True)
    website_url = Column(String(500), nullable=True)
    brands = Column(String(255)) # Stored as comma separated, e.g. "duyamis,donemilio"
