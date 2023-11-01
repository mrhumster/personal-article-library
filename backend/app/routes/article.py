from fastapi import APIRouter, Body, UploadFile, Depends, Form, File
from fastapi.encoders import jsonable_encoder
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from utils.db import add_article
from utils.schema import ResponseModel, ArticleSchema

router = APIRouter()

@router.post("/", response_description="Новая статья добавлена")
async def add_article_data( article: ArticleSchema = Depends(),
                            user = Depends(get_current_active_user)):

    logger.info(article)
    return ResponseModel({'file': file.filename}, message="Новая статья добавлена")
