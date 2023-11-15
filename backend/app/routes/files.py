from fastapi import APIRouter

from utils.environment import Config

router = APIRouter()

UPLOADS = Config.UPLOADS

def addFile():
    pass