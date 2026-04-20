import random

new_content = """from sqlalchemy.orm import Session
from models import User, Device, TransferRequest
from database import engine, Base, SessionLocal

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).count() > 0:
        db.close()
        return

    users = [
        User(name="Admin User", email="admin", department="Operations", role="admin", password="admin"),
        User(name="Standard User", email="user", department="Engineering", role="member", password="user"),
        User(name="Priya Sharma", email="priya@company.com", department="Platform", role="member", password="password"),
    ]
    db.add_all(users)
    db.flush()

    projects = [f"Project Alpha-{i}" for i in range(1, 40)] + ["Platform", "Modem", "Camera", "Display", "Audio", "Connectivity"]
    
    devices = []
    for i in range(1, 61):
        target = "ERD" if i % 2 == 0 else "SMDK"
        team = random.choice(projects)
        d = Device(
            target_board=target, 
            asset_device_no=f"{target}-{i:03d}", 
            serial_number=f"SN-{target[0]}{i:03d}",
            project_team=team,
            acquired_date="2025-01-01",
            status="available",
            hw_revision="v1.0",
            location="Storage Room"
        )
        devices.append(d)
        
    # Make a few in use
    devices[0].status = "in_use"
    devices[0].owner_id = 1
    devices[0].current_owner_id = 1
    
    devices[1].status = "in_use"
    devices[1].owner_id = 2
    devices[1].current_owner_id = 2

    db.add_all(devices)
    db.flush()

    # Transfers
    transfers = [
        TransferRequest(device_id=devices[1].id, requester_id=1, current_holder_id=2, status="pending", notes="Admin needs user's device for debug.")
    ]
    db.add_all(transfers)

    db.commit()
    db.close()
"""
with open('server/seed.py', 'w') as f:
    f.write(new_content)
