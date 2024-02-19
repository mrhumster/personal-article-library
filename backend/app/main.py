from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import router as user_router
from routes.article import router as article_route
from routes.files import router as files_router
from routes.collections import router as collections_router
from routes.notebook import router as notebooks_router
from utils.environment import Config


app = FastAPI(title='Personal Article Library API',
              description='API build for MongoDB with FastAPI',
              version='0.1',
              docs_url='/docs',
              redoc_url='/redoc')

origins = [
    "https://base",
    "https://0.0.0.0",
    "https://localhost",
    "https://backend",
    f"https://{Config.HOSTNAME}"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, tags=['Users'], prefix="/users")
app.include_router(article_route, tags=['Articles'], prefix="/articles")
app.include_router(files_router, tags=['Files'], prefix='/files')
app.include_router(collections_router, tags=['Collections'], prefix='/collections')
app.include_router(notebooks_router, tags=['Notebooks'], prefix='/notebooks')

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the PAL API"}

