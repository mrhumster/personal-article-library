from fastapi import APIRouter, Body, UploadFile
from fastapi.encoders import jsonable_encoder

from utils.schema import ResponseModel

router = APIRouter()


@router.post("/", response_description="Новая статья добавлена")
async def add_article_data(file: UploadFile | None = None, article: ArticleSchema = Body(...)):
    article = jsonable_encoder(article)
    new_article = await add_user(article)
    return ResponseModel(new_article, "Новая статья добавлена")
