import datetime
import os.path
import uuid

from fastapi import APIRouter, UploadFile, Depends, HTTPException, Body
from starlette import status
from starlette.background import BackgroundTasks
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from utils.db import add_article, retrieve_articles, retrieve_article, update_article
from utils.environment import Config
from utils.schema import ResponseModel, User, ArticleSchema, ArticleInDB, UpdateArticleModel

router = APIRouter()

UPLOADS = Config.UPLOADS

async def get_article_permission(article_id: str, current_user: User):
    article = await retrieve_article(article_id)
    if article and article['owner'] != current_user['username']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Нет доступа к статье',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    else:
        return article

async def analyzeFile(file_uuid, user, meta):
    """
    Create
    """
    article = ArticleInDB.parse_obj({
        'owner': user['username'],
        'added': datetime.datetime.now(),
        'files': [{
            'file_uuid': file_uuid,
            'file_name': meta['original_name']
        }],
        'title': meta['original_name'],
        'authors': [],
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

@router.get("/{article_id}", response_description='Статья')
async def get_article_data(article_id: str, current_user: User = Depends(get_current_active_user)):
    article = await get_article_permission(article_id, current_user)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            headers={'WWW-Authenticate': 'Bearer'}
        )
    return ResponseModel(article, 'Ok')

@router.put("/{article_id}", response_description='Статья')
async def update_article_data(article_id: str, req: UpdateArticleModel = Body(...), current_user: User = Depends(get_current_active_user)):
    article = await get_article_permission(article_id, current_user)
    logger.info(req)
    req = {k: v for k, v in req.dict().items() if v is not None}
    updated_article = await update_article(article_id, req)
    if updated_article:
        return ResponseModel(updated_article, "Article updated successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            headers={'WWW-Authenticate': 'Bearer'})