import datetime
import os
import uuid

from fastapi import APIRouter, UploadFile, Depends, HTTPException, Body
from starlette import status
from starlette.background import BackgroundTasks
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from db_requests.files import add_file, retrieve_file, update_file, isFileExists
from helpers.response import ResponseModel
from schema.files import FileWithOwner, FileScheme
from schema.user import User
from utils.analyze_document import add_pdf_to_es
from utils.environment import Config
from utils.validators import validate_files

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

    exist = await isFileExists(
        owner=current_user['username'],
        file_name=attach.filename,
        extension=file_extension[1:],
        size=len(contents)
    )


    if exist:
        return exist

    if not os.path.exists(UPLOADS):
        os.mkdir(UPLOADS)

    file_path = f'{UPLOADS}{filename}'

    with open(file_path, 'wb') as f:
        f.write(contents)

    attach.file.close()
    new_file_metadata = FileWithOwner.parse_obj({
        'owner': current_user['username'],
        'file_name':  attach.filename,
        'file_uuid': filename,
        'extension': file_extension[1:],
        'created': datetime.datetime.fromtimestamp(os.path.getatime(file_path)),
        'size': len(contents),
        'history': None
    })

    new_file = await add_file(new_file_metadata)
    background_tasks.add_task(add_pdf_to_es, new_file)
    return new_file

@router.get('/{file_id}')
async def get_file(file_id: str, user: User = Depends(get_current_active_user)):
    try:
        await validate_files([file_id], user)
    except ValueError:
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, headers={'WWW-Authenticate': 'Bearer'})

    file = await retrieve_file(file_id)

    if file:
        return ResponseModel(file, 'File meta retrieve')



@router.post('/{file_id}')
async def update_file_data(file_id: str, req: FileScheme = Body(...), user: User = Depends(get_current_active_user)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    updated_file = await update_file(file_id, req)
    if updated_file:
        return ResponseModel(updated_file, "File updated successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            headers={'WWW-Authenticate': 'Bearer'})