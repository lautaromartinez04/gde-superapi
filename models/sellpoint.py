from sqlalchemy import Column, BigInteger, Text, Float, ForeignKey, Integer, Date
from sqlalchemy.orm import relationship
from database import Base

class City(Base):
    __tablename__ = "cities"
    __table_args__ = {"schema": "wda"}

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)

    sellers = relationship("Seller", back_populates="city", cascade="all, delete-orphan", order_by="Seller.display_order")

class Seller(Base):
    __tablename__ = "sellers"
    __table_args__ = {"schema": "wda"}

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    address = Column(Text)
    maps_url = Column(Text)
    lat = Column(Float)
    lng = Column(Float)
    start_date = Column(Date, nullable=True)
    display_order = Column(Integer, default=0)
    city_id = Column(BigInteger, ForeignKey("wda.cities.id", ondelete="CASCADE"))

    city = relationship("City", back_populates="sellers")
