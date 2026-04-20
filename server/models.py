from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=True)
    role = Column(String, default="member")
    password = Column(String, nullable=False, default="password")

    owned_devices = relationship("Device", foreign_keys="Device.owner_id", back_populates="owner")
    current_devices = relationship("Device", foreign_keys="Device.current_owner_id", back_populates="current_owner")
    transfer_requests = relationship("TransferRequest", foreign_keys="TransferRequest.requester_id", back_populates="requester")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, autoincrement=True)
    target_board = Column(String, nullable=False)  # 'ERD' | 'SMDK'
    asset_device_no = Column(String, unique=True, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    sample_number = Column(String, nullable=True)
    project_team = Column(String, nullable=False)
    hw_revision = Column(String, nullable=True)
    mac_address = Column(String, nullable=True)
    ram_size = Column(String, nullable=True)
    storage_capacity = Column(String, nullable=True)
    os_version = Column(String, nullable=True)
    location = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    current_owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    acquired_date = Column(String, nullable=False)
    release_date = Column(String, nullable=True)
    status = Column(String, default="available")  # 'available' | 'in_use' | 'maintenance' | 'retired'
    summary = Column(Text, nullable=True)

    owner = relationship("User", foreign_keys=[owner_id], back_populates="owned_devices")
    current_owner = relationship("User", foreign_keys=[current_owner_id], back_populates="current_devices")
    transfer_requests = relationship("TransferRequest", back_populates="device")


class TransferRequest(Base):
    __tablename__ = "transfer_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_holder_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="pending")  # 'pending' | 'approved' | 'rejected' | 'queued'
    priority = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    resolved_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    device = relationship("Device", back_populates="transfer_requests")
    requester = relationship("User", foreign_keys=[requester_id], back_populates="transfer_requests")
    current_holder = relationship("User", foreign_keys=[current_holder_id])
