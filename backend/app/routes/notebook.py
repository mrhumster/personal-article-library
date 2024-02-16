import datetime

from fastapi import APIRouter, Depends, HTTPException, Body
from starlette import status
from starlette.responses import JSONResponse

from helpers.response import ResponseModel
from requests.notebook import add, retrieve, refresh, remove
from authorisation.auth import get_current_active_user
from schema.notebook import Notebook as modelSchema
from schema.notebook import NotebookWithOwner as modelSchemaWithOwner
from schema.user import User

router = APIRouter()

async def check_permission(object_id: str, user: User) -> dict:
    checked_object = await retrieve(object_id)
    if not checked_object:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='The object was not found',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    if checked_object['owner'] != user['username']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='You do not have access to this object',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    return checked_object

@router.post('/')
async def create(data: modelSchema, current_user: User = Depends(get_current_active_user)):
    data = data.dict()
    data['owner'] = current_user['username']
    data['created'] = datetime.datetime.now()
    data['changed'] = datetime.datetime.now()
    data = modelSchemaWithOwner.parse_obj(data)
    data = await add(data)
    return data if data else HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

@router.get('/{object_id}')
async def read(object_id: str, current_user: User = Depends(get_current_active_user)):
    readable_object = await check_permission(object_id, current_user)
    return ResponseModel(readable_object, 'Notebook retrieved')

@router.post('/{object_id}')
async def update(object_id: str, req: modelSchema = Body(...), current_user: User = Depends(get_current_active_user)):
    await check_permission(object_id, current_user)
    req = {k: v for k, v in req.dict().items() if v is not None}
    updated_object = await refresh(object_id, req)
    if updated_object: return ResponseModel(updated_object, 'Notebook updated')
    raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, headers={'WWW-Authenticate': 'Bearer'})

@router.delete('/{object_id}')
async def delete(object_id: str, current_user: User = Depends(get_current_active_user)):
    await check_permission(object_id, current_user)
    removed = await remove(object_id)
    if removed:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={'message': 'Notebook is deleted'})
    HTTPException(
        status_code=status.HTTP_204_NO_CONTENT,
        headers={'WWW-Authenticate': 'Bearer'}
    )