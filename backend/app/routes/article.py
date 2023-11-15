import datetime
import os.path
import uuid
from typing import Optional

from bson.errors import InvalidId
from fastapi import APIRouter, UploadFile, Depends, HTTPException, Body, Form
from pydantic import ValidationError
from starlette import status
from starlette.background import BackgroundTasks
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from helpers.response import ResponseModel
from requests.article import add_article, retrieve_articles, retrieve_article, update_article
from requests.files import retrieve_file
from schema.article import ArticleInDB, UpdateArticleModel, NewArticleSchema
from schema.user import User
from utils.environment import Config
from utils.validators import validate_files

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
    if meta['article'] is None:
        article = ArticleInDB.parse_obj({
            'owner': user['username'],
            'added': datetime.datetime.now(),
            'files': [{
                'file_uuid': file_uuid,
                'file_name': meta['original_name'],
                'extension': meta['extension'],
                'size': meta['size'],
                'created': meta['created']
            }],
            'title': meta['original_name'],
            'authors': [],
        })
        article = await add_article(article)
        return article
    else:
        article = await retrieve_article(meta['article'])
        updated_article = await update_article(meta['article'], {
            'files': [{
                'file_uuid': file_uuid,
                'file_name': meta['original_name'],
                'extension': meta['extension'],
                'size': meta['size'],
                'created': meta['created']
            }]+article['files']})
        return updated_article

@router.post("/upload", status_code=201)
async def upload(attach: UploadFile, background_tasks: BackgroundTasks, article: Optional[str] = Form(None), current_user: User = Depends(get_current_active_user)):
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
    meta['article'] = article
    meta['extension'] = file_extension[1:]
    meta['size'] = len(contents)


    if not os.path.exists(UPLOADS):
        os.mkdir(UPLOADS)

    file_path = f'{UPLOADS}{filename}'

    with open(file_path, 'wb') as f:
        f.write(contents)

    meta['created'] = datetime.datetime.fromtimestamp(os.path.getatime(file_path))

    background_tasks.add_task(analyzeFile, file_uuid=filename, user=current_user, meta=meta)
    attach.file.close()
    return {'meta': meta}

@router.post("/")
async def create_article(article_data: NewArticleSchema, current_user: User = Depends(get_current_active_user)):
    data = article_data.dict()

    if data['files']:
        try:
            await validate_files(file_ids=data['files'], user=current_user)
        except ValueError as e:
            return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'Files validate fails: {e}')

    data['owner'] = current_user['username']
    data['added'] = datetime.datetime.now()
    article_data = ArticleInDB.parse_obj(data)
    article = await add_article(article_data)
    return article if article else HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    req = {k: v for k, v in req.dict().items() if v is not None}
    logger.info(req)
    updated_article = await update_article(article_id, req)
    if updated_article:
        return ResponseModel(updated_article, "Article updated successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            headers={'WWW-Authenticate': 'Bearer'})