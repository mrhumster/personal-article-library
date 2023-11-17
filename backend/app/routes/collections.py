from fastapi import APIRouter, Depends, HTTPException, Body
from starlette import status
from starlette.responses import JSONResponse

from authorisation.auth import get_current_active_user
from helpers.response import ResponseModel
from requests.collections import retrieve_my_collections, add_collection, retrieve_collection, update_collection, \
    delete_collection
from schema.collections import CollectionsSchema, CollectionsSchemaWithOwner
from schema.user import User
from utils.environment import Config
from utils.validators import validate_articles

router = APIRouter()

UPLOADS = Config.UPLOADS

async def get_collection_permission(collection_id: str, current_user: User):
    collection = await retrieve_collection(collection_id)
    if collection and collection['owner'] != current_user['username']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Нет доступа к коллекции',
            headers={'WWW-Authenticate': 'Bearer'}
        )
    else:
        return collection

@router.get("/")
async def get_my_collections(user: User = Depends(get_current_active_user)):
    collections_list = await retrieve_my_collections(user)
    if collections_list:
        return collections_list
    raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/")
async def create_my_collection(data: CollectionsSchema, user: User = Depends(get_current_active_user)):
    data = data.dict()

    try:
        await validate_articles(articles_ids=data['articles'], user=user)
    except ValueError as e:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Collection validate fails: {e}')

    data['owner'] = user['username']
    new_collection = CollectionsSchemaWithOwner.parse_obj(data)
    collection = await add_collection(new_collection)
    return collection if collection else HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

@router.put("/{collection_id}")
async def update_my_collection(collection_id: str, data: CollectionsSchema = Body(...), user: User = Depends(get_current_active_user)):
    await get_collection_permission(collection_id, user)
    data = {k: v for k, v in data.dict().items() if v is not None}

    try:
        await validate_articles(articles_ids=data['articles'], user=user)
    except ValueError as e:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Collection validate fails: {e}')

    updated_collection = await update_collection(collection_id, data)
    if updated_collection:
        return ResponseModel(updated_collection, "Collection updated successfully")
    else:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            headers={'WWW-Authenticate': 'Bearer'}
        )

@router.delete("/{collection_id}")
async def delete_my_collection(collection_id: str, user: User = Depends(get_current_active_user)):
    await get_collection_permission(collection_id, user)
    if await delete_collection(collection_id):
        return JSONResponse({
            'message': f'Collection {collection_id} delete successfully',
            'collection_id': collection_id
        }, status_code=status.HTTP_200_OK)
    return JSONResponse({
        'message': f'Collection {collection_id} not found',
        'collection_id': collection_id
    }, status_code=status.HTTP_400_BAD_REQUEST)
