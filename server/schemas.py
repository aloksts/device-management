from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── User Schemas ──
class UserBase(BaseModel):
    name: str
    email: str
    department: Optional[str] = None
    role: str = "member"

class UserCreate(UserBase):
    password: str

class LoginData(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int
    device_count: int = 0
    model_config = {"from_attributes": True}


# ── Device Schemas ──
class DeviceBase(BaseModel):
    target_board: str
    asset_device_no: str
    serial_number: str
    sample_number: Optional[str] = None
    project_team: str
    hw_revision: Optional[str] = None
    mac_address: Optional[str] = None
    ram_size: Optional[str] = None
    storage_capacity: Optional[str] = None
    os_version: Optional[str] = None
    location: Optional[str] = None
    acquired_date: str
    release_date: Optional[str] = None
    status: str = "available"
    summary: Optional[str] = None

class DeviceCreate(DeviceBase):
    owner_id: Optional[int] = None
    current_owner_id: Optional[int] = None

class DeviceUpdate(BaseModel):
    target_board: Optional[str] = None
    asset_device_no: Optional[str] = None
    serial_number: Optional[str] = None
    sample_number: Optional[str] = None
    project_team: Optional[str] = None
    hw_revision: Optional[str] = None
    mac_address: Optional[str] = None
    ram_size: Optional[str] = None
    storage_capacity: Optional[str] = None
    os_version: Optional[str] = None
    location: Optional[str] = None
    owner_id: Optional[int] = None
    current_owner_id: Optional[int] = None
    acquired_date: Optional[str] = None
    release_date: Optional[str] = None
    status: Optional[str] = None
    summary: Optional[str] = None

class DeviceOut(DeviceBase):
    id: int
    owner_id: Optional[int] = None
    current_owner_id: Optional[int] = None
    owner_name: Optional[str] = None
    current_owner_name: Optional[str] = None
    model_config = {"from_attributes": True}


# ── Transfer Request Schemas ──
class TransferRequestCreate(BaseModel):
    device_id: int
    requester_id: int
    notes: Optional[str] = None

class TransferRequestOut(BaseModel):
    id: int
    device_id: int
    requester_id: int
    current_holder_id: Optional[int] = None
    status: str
    priority: int
    created_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    notes: Optional[str] = None
    device_name: Optional[str] = None
    requester_name: Optional[str] = None
    holder_name: Optional[str] = None
    model_config = {"from_attributes": True}


# ── Dashboard Schemas ──
class DashboardStats(BaseModel):
    total_users: int
    total_devices: int
    acquired_devices: int
    available_devices: int
    in_use_devices: int
    maintenance_devices: int
    retired_devices: int
    erd_count: int
    smdk_count: int
    pending_transfers: int
