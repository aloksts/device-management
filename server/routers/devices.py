from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Device, User
from schemas import DeviceOut, DeviceCreate, DeviceUpdate
from typing import List, Optional

router = APIRouter(prefix="/api/devices", tags=["Devices"])


def _device_to_out(device: Device) -> DeviceOut:
    return DeviceOut(
        id=device.id,
        target_board=device.target_board,
        asset_device_no=device.asset_device_no,
        serial_number=device.serial_number,
        sample_number=device.sample_number,
        project_team=device.project_team,
        hw_revision=device.hw_revision,
        mac_address=device.mac_address,
        ram_size=device.ram_size,
        storage_capacity=device.storage_capacity,
        os_version=device.os_version,
        location=device.location,
        owner_id=device.owner_id,
        current_owner_id=device.current_owner_id,
        acquired_date=device.acquired_date,
        release_date=device.release_date,
        status=device.status,
        summary=device.summary,
        owner_name=device.owner.name if device.owner else None,
        current_owner_name=device.current_owner.name if device.current_owner else None,
    )


@router.get("", response_model=List[DeviceOut])
def list_devices(
    status: Optional[str] = Query(None),
    board: Optional[str] = Query(None),
    team: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(Device)
    if status:
        q = q.filter(Device.status == status)
    if board:
        q = q.filter(Device.target_board == board)
    if team:
        q = q.filter(Device.project_team == team)
    devices = q.all()
    return [_device_to_out(d) for d in devices]


@router.get("/{device_id}", response_model=DeviceOut)
def get_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return _device_to_out(device)


@router.post("", response_model=DeviceOut, status_code=201)
def create_device(device_in: DeviceCreate, db: Session = Depends(get_db)):
    device = Device(**device_in.model_dump())
    db.add(device)
    db.commit()
    db.refresh(device)
    return _device_to_out(device)


@router.put("/{device_id}", response_model=DeviceOut)
def update_device(device_id: int, device_in: DeviceUpdate, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    update_data = device_in.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(device, key, val)
    db.commit()
    db.refresh(device)
    return _device_to_out(device)


@router.delete("/{device_id}", status_code=204)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    device.status = "retired"
    db.commit()
    return None

@router.get("/teams/all")
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(Device.project_team).distinct().all()
    return [t[0] for t in teams if t[0]]
