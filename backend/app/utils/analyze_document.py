import base64
import logging

import elastic_transport
from elasticsearch import Elasticsearch, NotFoundError, AsyncElasticsearch
from uvicorn.main import logger

from utils.environment import Config

UPLOADS = Config.UPLOADS
logging.basicConfig(filename='/var/log/backend/background_task.log', format='%(levelname)s:%(message)s', level=logging.INFO)
client = Elasticsearch("http://es:9200")
async_client = AsyncElasticsearch('http://es:9200', basic_auth="")
article_index = 'articles'
files_index = 'files'

def check_if_the_file_is_in_the_index(file_id: str) -> bool:
    try:
        client.get(index=files_index, id=file_id)
        return True
    except NotFoundError:
        return False


def add_pdf_to_es(file: dict):
    file_path = f'{UPLOADS}{file["file_uuid"]}'
    file_id = file['id']
    with open(file_path, 'rb') as f:
        file_b64 = base64.b64encode(f.read())
        file['data'] = file_b64.decode('utf-8')
        response = client.index(index=files_index, id=file_id, document=file, pipeline='attachment')

async def update_file_in_es(file: dict):
    file_id = file['id']
    try:
        await async_client.update(index=files_index, id=file_id, doc=file)
    except NotFoundError:
        add_pdf_to_es(file)

async def remove_file_from_es(file_id: str):
    try:
        await async_client.delete(index=files_index, id=file_id)
    except NotFoundError as e:
        logger.info(e)

def update_article_in_es(article: dict):
    article_id = article['id']
    try:
        client.get(index=article_index, id=article_id)
        client.update(index=article_index, id=article_id, doc=article)
    except NotFoundError:
        client.index(index=article_index, id=article_id, document=article)


def delete_article_in_es(article_id: str):
    client.delete(index=article_index, id=article_id)

def create_article_in_es(article: dict):
    article_id = article['id']
    try:
        client.index(index=article_index, id=article_id, document=article)
    except elastic_transport.ConnectionError:
        logger.info('Elastic search not available')