from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database import get_db
from models import Device, TransferRequest, User
from schemas import TransferRequestCreate, TransferRequestOut
from typing import List, Optional

router = APIRouter(prefix="/api/transfers", tags=["Transfers"])


def _transfer_to_out(t: TransferRequest, db: Session) -> TransferRequestOut:
    device = db.query(Device).filter(Device.id == t.device_id).first()
    requester = db.query(User).filter(User.id == t.requester_id).first()
    holder = db.query(User).filter(User.id == t.current_holder_id).first() if t.current_holder_id else None
    return TransferRequestOut(
        id=t.id,
        device_id=t.device_id,
        requester_id=t.requester_id,
        current_holder_id=t.current_holder_id,
        status=t.status,
        priority=t.priority,
        created_at=t.created_at,
        resolved_at=t.resolved_at,
        notes=t.notes,
        device_name=f"{device.target_board} — {device.asset_device_no}" if device else None,
        requester_name=requester.name if requester else None,
        holder_name=holder.name if holder else None,
    )


@router.get("", response_model=List[TransferRequestOut])
def list_transfers(
    status: Optional[str] = Query(None),
    device_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(TransferRequest)
    if status:
        q = q.filter(TransferRequest.status == status)
    if device_id:
        q = q.filter(TransferRequest.device_id == device_id)
    if user_id:
        q = q.filter(TransferRequest.requester_id == user_id)
    transfers = q.order_by(TransferRequest.created_at.desc()).all()
    return [_transfer_to_out(t, db) for t in transfers]


@router.get("/queue/{device_id}", response_model=List[TransferRequestOut])
def get_device_queue(device_id: int, db: Session = Depends(get_db)):
    transfers = (
        db.query(TransferRequest)
        .filter(TransferRequest.device_id == device_id)
        .filter(TransferRequest.status.in_(["pending", "queued"]))
        .order_by(TransferRequest.priority, TransferRequest.created_at)
        .all()
    )
    return [_transfer_to_out(t, db) for t in transfers]


@router.post("/request", response_model=TransferRequestOut, status_code=201)
def create_transfer(req: TransferRequestCreate, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == req.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    requester = db.query(User).filter(User.id == req.requester_id).first()
    if not requester:
        raise HTTPException(status_code=404, detail="Requester not found")

    # If device is available → auto-approve
    if device.status == "available":
        device.current_owner_id = req.requester_id
        device.status = "in_use"
        transfer = TransferRequest(
            device_id=req.device_id,
            requester_id=req.requester_id,
            current_holder_id=None,
            status="approved",
            resolved_at=func.now(),
            notes=req.notes,
        )
        db.add(transfer)
        db.commit()
        db.refresh(transfer)
        return _transfer_to_out(transfer, db)

    # If device is in_use → check existing queue
    existing = (
        db.query(TransferRequest)
        .filter(TransferRequest.device_id == req.device_id)
        .filter(TransferRequest.status.in_(["pending", "queued"]))
        .count()
    )

    if existing == 0:
        # First request → pending
        transfer = TransferRequest(
            device_id=req.device_id,
            requester_id=req.requester_id,
            current_holder_id=device.current_owner_id,
            status="pending",
            priority=0,
            notes=req.notes,
        )
    else:
        # Queued
        transfer = TransferRequest(
            device_id=req.device_id,
            requester_id=req.requester_id,
            current_holder_id=device.current_owner_id,
            status="queued",
            priority=existing,
            notes=req.notes,
        )

    db.add(transfer)
    db.commit()
    db.refresh(transfer)
    return _transfer_to_out(transfer, db)


@router.put("/{transfer_id}/approve", response_model=TransferRequestOut)
def approve_transfer(transfer_id: int, db: Session = Depends(get_db)):
    transfer = db.query(TransferRequest).filter(TransferRequest.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    if transfer.status not in ("pending",):
        raise HTTPException(status_code=400, detail="Only pending transfers can be approved")

    device = db.query(Device).filter(Device.id == transfer.device_id).first()
    device.current_owner_id = transfer.requester_id
    device.status = "in_use"
    transfer.status = "approved"
    transfer.resolved_at = func.now()
    db.commit()
    db.refresh(transfer)

    # Promote next in queue to pending
    next_in_queue = (
        db.query(TransferRequest)
        .filter(TransferRequest.device_id == transfer.device_id)
        .filter(TransferRequest.status == "queued")
        .order_by(TransferRequest.priority, TransferRequest.created_at)
        .first()
    )
    if next_in_queue:
        next_in_queue.status = "pending"
        next_in_queue.current_holder_id = transfer.requester_id
        db.commit()

    return _transfer_to_out(transfer, db)


@router.put("/{transfer_id}/reject", response_model=TransferRequestOut)
def reject_transfer(transfer_id: int, db: Session = Depends(get_db)):
    transfer = db.query(TransferRequest).filter(TransferRequest.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")
    if transfer.status not in ("pending",):
        raise HTTPException(status_code=400, detail="Only pending transfers can be rejected")

    transfer.status = "rejected"
    transfer.resolved_at = func.now()
    db.commit()
    db.refresh(transfer)

    # Promote next in queue
    next_in_queue = (
        db.query(TransferRequest)
        .filter(TransferRequest.device_id == transfer.device_id)
        .filter(TransferRequest.status == "queued")
        .order_by(TransferRequest.priority, TransferRequest.created_at)
        .first()
    )
    if next_in_queue:
        next_in_queue.status = "pending"
        db.commit()

    return _transfer_to_out(transfer, db)
