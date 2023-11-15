from bson.errors import InvalidId

from requests.files import retrieve_file
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