from elasticsearch import AsyncElasticsearch
from fastapi import APIRouter, Depends

from authorisation.auth import get_current_active_user
from schema.user import User

router = APIRouter()
client = AsyncElasticsearch('http://es:9200')

@router.post("/")
async def get_result_from_es(query: str, current_user: User = Depends(get_current_active_user)):
    response = await client.search(
        index='articles,files',
        body={
          "query": {
            "simple_query_string": {
              "query": query,
              "fields": [
                "title",
                "attachment.content",
                "attachment.title",
                "authors*"
              ]
            }
          },
          "_source": False
        },
        size=10)
    return response