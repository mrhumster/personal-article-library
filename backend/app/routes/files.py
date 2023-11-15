import datetime
import os
import uuid

from fastapi import APIRouter, UploadFile, Depends, HTTPException
from starlette import status
from starlette.background import BackgroundTasks
from uvicorn.server import logger

from authorisation.auth import get_current_active_user
from helpers.files import file_helper
from requests.files import add_file, retrieve_file
from schema.files import FileWithOwner
from schema.user import User
from utils.environment import Config

router = APIRouter()

UPLOADS = Config.UPLOADS


@router.post("/", status_code=201)
async def upload(attach: UploadFile,
                 # TODO: Сделать проверку на существование файла
                 background_tasks: BackgroundTasks,
                 current_user:
                 User = Depends(get_current_active_user)):
    contents = attach.file.read()
    title, file_extension = os.path.splitext(attach.filename)
    if file_extension.lower() not in ['.pdf']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Допускается загрузка только файлов формата PDF.',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    filename = f'{uuid.uuid4()}{file_extension}'

    if not os.path.exists(UPLOADS):
        os.mkdir(UPLOADS)

    file_path = f'{UPLOADS}{filename}'

    with open(file_path, 'wb') as f:
        f.write(contents)

    attach.file.close()
    logger.info(current_user)
    new_file_metadata = FileWithOwner.parse_obj({
        'owner': current_user['username'],
        'file_name':  attach.filename,
        'file_uuid': filename,
        'extension': file_extension[1:],
        'created': datetime.datetime.fromtimestamp(os.path.getatime(file_path)),
        'size': len(contents)
    })

    new_file = await add_file(new_file_metadata)
    return new_file

@router.get('/{file_id}')
async def get_file(file_id: str, user: User = Depends(get_current_active_user)):
    file = await retrieve_file(file_id)
    logger.info(f'*** {file}')
    return HTTPException(status_code=status.HTTP_204_NO_CONTENT) if not file \
        else file if file['owner'] == user['username'] \
        else HTTPException(status_code=status.HTTP_403_FORBIDDEN)
