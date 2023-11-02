import datetime
import os.path
import uuid

from fastapi import APIRouter, UploadFile, Depends, HTTPException
from starlette import status
from starlette.background import BackgroundTasks
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from utils.db import add_article, retrieve_articles
from utils.environment import Config
from utils.schema import ResponseModel, User, ArticleSchema, ArticleInDB

router = APIRouter()

UPLOADS = Config.UPLOADS

async def analyzeFile(file_uuid, user, meta):
    """
    Create
    """
    article = ArticleInDB.parse_obj({
        'owner': user['username'],
        'added': datetime.datetime.now(),
        'file_uuid': file_uuid,
        'file_name': meta['original_name']

    })
    article = await add_article(article)
    return article

@router.post("/upload", status_code=201)
async def upload(attach: UploadFile, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_active_user)):
    meta = {}
    contents = attach.file.read()
    title, file_extension = os.path.splitext(attach.filename)
    if file_extension.lower() not in ['.pdf']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Допускается загрузка только файлов формата PDF.',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    filename = f'{uuid.uuid4()}{file_extension}'
    meta['original_name'] = attach.filename
    meta['title'] = title
    meta['author'] = current_user['username']
    if not os.path.exists(UPLOADS):
        os.mkdir(UPLOADS)
    with open(f'{UPLOADS}{filename}', 'wb') as f:
        f.write(contents)

    background_tasks.add_task(analyzeFile, file_uuid=filename, user=current_user, meta=meta)
    attach.file.close()
    return {'meta': meta}

@router.get("/", response_description="Статьи")
async def get_articles(current_user: User = Depends(get_current_active_user)):
    articles = await retrieve_articles(current_user)
    if articles:
        return {'articles': articles}
    raise HTTPException(
        status_code=status.HTTP_204_NO_CONTENT
    )