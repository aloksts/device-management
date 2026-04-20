from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Device, TransferRequest
from schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_devices = db.query(Device).count()
    acquired = db.query(Device).filter(Device.status == "in_use").count()
    available = db.query(Device).filter(Device.status == "available").count()
    maintenance = db.query(Device).filter(Device.status == "maintenance").count()
    retired = db.query(Device).filter(Device.status == "retired").count()
    erd = db.query(Device).filter(Device.target_board == "ERD").count()
    smdk = db.query(Device).filter(Device.target_board == "SMDK").count()
    pending = db.query(TransferRequest).filter(TransferRequest.status.in_(["pending", "queued"])).count()

    return DashboardStats(
        total_users=total_users,
        total_devices=total_devices,
        acquired_devices=acquired,
        available_devices=available,
        in_use_devices=acquired,
        maintenance_devices=maintenance,
        retired_devices=retired,
        erd_count=erd,
        smdk_count=smdk,
        pending_transfers=pending,
    )
