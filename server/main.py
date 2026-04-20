from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from seed import seed_database
from routers import dashboard, devices, users, transfers

app = FastAPI(title="Asset Tracker API", version="1.0.0")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard.router)
app.include_router(devices.router)
app.include_router(users.router)
app.include_router(transfers.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()


@app.get("/")
def root():
    return {"message": "Asset Tracker API is running 🚀"}
