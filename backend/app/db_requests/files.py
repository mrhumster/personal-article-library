import os

import motor.motor_asyncio
from bson import ObjectId
from uvicorn.main import logger

from helpers.files import file_helper
from schema.files import FileWithOwner
from utils.analyze_document import remove_file_from_es
from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
files_collection = database.get_collection("files_collection")

UPLOADS = Config.UPLOADS

async def isFileExists(owner: str, file_name: str, extension: str, size: int) -> bool | dict:
    logger.info(f'{owner=}')
    logger.info(f'{file_name=}')
    logger.info(f'{extension=}')
    logger.info(f'{size=}')
    founded = await files_collection.find_one({
        "owner": owner,
        "file_name": file_name,
        "extension": extension,
        "size": size
    })
    if founded:
        return file_helper(founded)
    return False




async def add_file(data: FileWithOwner) -> dict:
    file = await files_collection.insert_one(data.dict())
    new_file = await files_collection.find_one({"_id": file.inserted_id})
    return file_helper(new_file)

async def retrieve_file(file_id: str) -> dict | bool:
    file = await files_collection.find_one({"_id": ObjectId(file_id)})
    return file_helper(file) if file else False

async def update_file(file_id: str, data: dict):

    if len(data) < 1:
        return False

    file = await files_collection.find_one({"_id": ObjectId(file_id)})

    if file:
        updated_file = await files_collection.update_one({"_id": ObjectId(file_id)}, {"$set": data})
        if updated_file:
            file = await files_collection.find_one({"_id": ObjectId(file_id)})
            return file_helper(file)

async def fileIsExists(file_id: str) -> bool:
    if await files_collection.find_one({"_id": ObjectId(file_id)}):
        return True
    return False

async def add_article_to_file(file_id: str, article_id: str) -> bool:
    if not await fileIsExists(file_id):
        return False
    if await files_collection.update_one({"_id": ObjectId(file_id)}, {"$addToSet" : {"articles": article_id}}):
        return True


async def remove_article_from_file(file_id: str, article_id: str) -> bool:
    if not await fileIsExists(file_id):
        return False
    if await files_collection.update_one({"_id": ObjectId(file_id)},{"$pull" : {"articles": article_id}}):
        await delete_the_file_if_it_is_orphaned(file_id)
        return True

async def delete_the_file_if_it_is_orphaned(file_id: str) -> bool:
    if not await fileIsExists(file_id):
        return False
    file = await files_collection.find_one(ObjectId(file_id))
    if len(file['articles']) == 0:
        path = f'{UPLOADS}{file["file_uuid"]}'
        if os.path.exists(f'{UPLOADS}{file["file_uuid"]}'):
            os.remove(path)
            logger.info(f'File {path} deleted form filesystem')
        else:
            logger.info(f'File {path} not exists on filesystem')
        await files_collection.delete_one({'_id': ObjectId(file_id)})
        await remove_file_from_es(file_id)
    return True