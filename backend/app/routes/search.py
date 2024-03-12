from elasticsearch import AsyncElasticsearch
from fastapi import APIRouter, Depends

from authorisation.auth import get_current_active_user
from schema.user import User

router = APIRouter()
client = AsyncElasticsearch('http://es:9200')

@router.get("/")
async def get_result_from_es(query: str, current_user: User = Depends(get_current_active_user)):
    return await client.search_template(
        index='articles,files',
        id='pal-search-template',
        params={
            "query_string": query,
            "owner": current_user['username']
        }
    )

@router.get("/suggest")
async def get_suggest_from_es(prefix: str, field_name: str):
    return await client.search_template(
        index='articles',
        id='pal-suggest-template',
        params={
            'prefix': prefix,
            "field_name": field_name
        }
    )