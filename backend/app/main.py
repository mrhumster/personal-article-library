from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as UserRouter
from utils.environment import Config


app = FastAPI(title='Event World App',
              description='API build for MongoDB with FastAPI',
              version='0.1',
              docs_url='/docs',
              redoc_url='/redoc')

origins = [
    "https://base",
    "https://0.0.0.0",
    "https://localhost",
    f"https://{Config.HOSTNAME}"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(UserRouter, tags=['Users'], prefix="/users")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the PAL API"}

