import motor.motor_asyncio
from bson import ObjectId

from helpers.collections import collection_helper
from schema.collections import CollectionsSchemaWithOwner
from schema.user import User
from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
collections = database.get_collection("collections")

async def add_collection(data: CollectionsSchemaWithOwner) -> dict:
    collection = await collections.insert_one(data.dict())
    new_collection = await collections.find_one({"_id": collection.inserted_id})
    return collection_helper(new_collection)

async def retrieve_collection(collection_id: str) -> dict | bool:
    collection = await collections.find_one({"_id": ObjectId(collection_id)})
    if collection:
        return collection_helper(collection)
    return False

async def delete_collection(collection_id: str):
    collection = await collections.find_one({"_id": ObjectId(collection_id)})
    if collection:
        await collections.delete_one({"_id": ObjectId(collection_id)})
        return True

async def update_collection(collection_id: str, data: dict):
    if len(data) < 1:
        return False
    collection = await collections.find_one({"_id": ObjectId(collection_id)})
    if collection:
        updated_collection = await collections.update_one(
            {"_id": ObjectId(collection_id)}, {'$set': data})
        if updated_collection:
            collection = await collections.find_one({"_id": ObjectId(collection_id)})
            return collection_helper(collection)

async def retrieve_my_collections(owner: User):
    collections_list = []
    async for collection in collections.find({'owner': owner['username']}):
        collections_list.append(collection_helper(collection))
    return collections_list