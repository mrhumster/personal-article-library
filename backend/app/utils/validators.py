from bson.errors import InvalidId

from db_requests.article import retrieve_article
from db_requests.files import retrieve_file
from schema.user import User


async def validate_files(file_ids: list, user: User):
    for file_id in file_ids:
        try:
            file = await retrieve_file(file_id)
            if not file:
                raise ValueError(f'File with id: "{file_id}" not exists')
            if file['owner'] != user['username']:
                raise ValueError(f'File with id: "{file_id}" not available for you')
        except InvalidId:
            raise ValueError(f'File id: "{file_id}" is not valid bson id')

async def validate_articles(articles_ids: list, user: User):
    for articles_id in articles_ids:
        try:
            article = await retrieve_article(articles_id)
            if not article:
                raise ValueError(f'Article with id: "{articles_id}" not exists')
            if article['owner'] != user['username']:
                raise ValueError(f'Article with id: "{articles_id}" not available for you')
        except InvalidId:
            raise ValueError(f'Article id: "{articles_id}" is not valid bson id')