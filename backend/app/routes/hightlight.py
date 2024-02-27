from fastapi import APIRouter, Depends, HTTPException, Body
from starlette import status

from authorisation.auth import get_current_active_user
from helpers.response import ResponseModel
from requests.highlight import add, retrieve, refresh, remove, retrieveByFile
from schema.highlight import HighlightScheme as modelSchema
from schema.highlight import HighlightWithOwnerScheme as modelSchemaWithOwner
from schema.user import User
from utils.classes import CustomDatetime
from utils.environment import DT_FORMAT

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
    data['changed'] = CustomDatetime.now().strftime(DT_FORMAT)
    data['created'] = CustomDatetime.now().strftime(DT_FORMAT)
    data = modelSchemaWithOwner.parse_obj(data)
    data = await add(data)
    return data if data else HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

@router.get('/{object_id}')
async def read(object_id: str, current_user: User = Depends(get_current_active_user)):
    readable_object = await check_permission(object_id, current_user)
    return ResponseModel(readable_object, 'Highlight retrieved')

@router.put('/{object_id}')
async def update(object_id: str, req: modelSchema = Body(...), current_user: User = Depends(get_current_active_user)):
    await check_permission(object_id, current_user)
    req = {k: v for k, v in req.dict().items() if v is not None}
    req['changed'] = CustomDatetime.now().strftime(DT_FORMAT)
    updated_object = await refresh(object_id, req)
    if updated_object: return ResponseModel(updated_object, 'Highlight updated')
    raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, headers={'WWW-Authenticate': 'Bearer'})

@router.delete('/{object_id}')
async def delete(object_id: str, current_user: User = Depends(get_current_active_user)):
    await check_permission(object_id, current_user)
    removed = await remove(object_id)
    if removed:
        return ResponseModel(data=removed, message='Highlight deleted successfully')
    HTTPException(
        status_code=status.HTTP_204_NO_CONTENT,
        headers={'WWW-Authenticate': 'Bearer'}
    )

@router.get('/by-file/{file_id}')
async def get_by_file(file_id: str, current_user: User = Depends(get_current_active_user)):
    data = await retrieveByFile(owner=current_user['username'], file_id=file_id)
    if data:
        return ResponseModel(data=data, message='Highlights retrieved')
    HTTPException(
        status_code=status.HTTP_204_NO_CONTENT,
        headers={'WWW-Authenticate': 'Bearer'}
    )