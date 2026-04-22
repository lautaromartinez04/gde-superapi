from sqlalchemy import Column, BigInteger, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Branch(Base):
    __tablename__ = "branches"
    __table_args__ = {"schema": "wde"}

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)
    maps_url = Column(Text, nullable=True)
    maps_embed_url = Column(Text, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    order = Column(Integer, default=0)

    schedules = relationship("BranchSchedule", back_populates="branch", cascade="all, delete-orphan", order_by="BranchSchedule.order")


class BranchSchedule(Base):
    __tablename__ = "branch_schedules"
    __table_args__ = {"schema": "wde"}

    id = Column(BigInteger, primary_key=True, index=True)
    branch_id = Column(BigInteger, ForeignKey("wde.branches.id", ondelete="CASCADE"), nullable=False)
    days = Column(String(255), nullable=False)
    hours = Column(String(255), nullable=False)
    order = Column(Integer, default=0)

    branch = relationship("Branch", back_populates="schedules")
