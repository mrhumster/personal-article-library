import elasticsearch
import requests
from elasticsearch import AsyncElasticsearch, Elasticsearch
from fastapi import APIRouter, Depends
from uvicorn.main import logger

from authorisation.auth import get_current_active_user
from schema.user import User
from utils.environment import Config

ES_URL = Config.ES_URL

router = APIRouter()
client = AsyncElasticsearch(ES_URL)
es = Elasticsearch(ES_URL)


def create_search_template(name, template):
    response = requests.put(f"{ES_URL}/_scripts/{name}", json=template)
    if response.status_code == 200:
        logger.info(f'Поисковый шаблон {name} успешно создан')
    else:
        logger.error('Ошибка при создании поискового шаблона')

@router.get("/")
async def get_result_from_es(query: str, current_user: User = Depends(get_current_active_user)):
    template_id = 'pal-search-template'
    try:
        return await client.search_template(
            index='articles,files',
            id=template_id,
            params={
                "query_string": query,
                "owner": current_user['username']
            }
        )
    except elasticsearch.NotFoundError as e:
        logger.error(e)
        if e.body['error']['root_cause'][0]['reason'] == 'unable to find script [pal-search-template] in cluster state':
            search_template = {
              "script": {
                "lang": "mustache",
                "source": {
                  "query": {
                    "bool": {
                      "must": [
                        {
                          "simple_query_string": {
                            "query": "{{query_string}}",
                            "fields": [
                              "title",
                              "attachment.content",
                              "attachment.title",
                              "authors*",
                              "file_name"
                            ],
                            "default_operator": "and"
                          }
                        }
                      ],
                      "filter": [
                          {"term": {"owner" : "{{owner}}"} }
                        ]
                    }
                  },
                  "_source": False,
                  "fields": [
                    "title",
                    "attachment.title",
                    "file_name",
                    "extension",
                    "articles",
                    "owner"
                  ],
                  "highlight": {
                    "fields": {
                      "title": {},
                      "file_name": {},
                      "attachment.content": {},
                      "authors.first_name": {},
                      "authors.last_name": {},
                      "authors.sur_name": {}
                    },
                    "boundary_max_scan": 140,
                    "fragment_size": 500
                  }
                },
                "params": {
                  "query_string": "My query string",
                  "owner": "username"
                }
              }
            }
            create_search_template(name=template_id, template=search_template)



@router.get("/suggest")
async def get_suggest_from_es(prefix: str, field_name: str):
    template_id = 'pal-suggest-template'
    try:
        return await client.search_template(
            index='articles',
            id=template_id,
            params={
                'prefix': prefix,
                "field_name": field_name
            }
        )
    except elasticsearch.NotFoundError as e:
        logger.error(e)
        if e.body['error']['root_cause'][0]['reason'] == 'unable to find script [pal-suggest-template] in cluster state':
            search_template = {
              "script": {
                "lang": "mustache",
                "source": {
                  "suggest": {
                    "song-suggest": {
                      "prefix": "{{prefix}}",
                      "completion": {
                          "field": "{{field_name}}",
                          "skip_duplicates": True
                      }
                    }
                  },
                  "_source": False
                },
                "params": {
                  "prefix": "Мос",
                  "field_name": "additional_information.city"
                }
              }
            }
            create_search_template(name=template_id, template=search_template)