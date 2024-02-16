import motor.motor_asyncio
from bson import ObjectId

from schema.notebook import NotebookWithOwner as modelSchema
from utils.environment import Config
from helpers.notebook import helper

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
db = client.pal
collection = db.get_collection('notebooks')

async def add(data: modelSchema):
    inserted_object = await collection.insert_one(data.dict())
    created_object = await collection.find_one({"_id": inserted_object.inserted_id})
    return helper(created_object)

async def retrieve(object_id: str) -> dict | bool:
    retrieve_object = await collection.find_one({"_id": ObjectId(object_id)})
    return helper(retrieve_object) if retrieve_object else False

async def refresh(object_id: str, data: dict) -> dict | bool:
    if len(data) < 1:
        return False
    updated_object = collection.find_one({"_id": ObjectId(object_id)})
    if updated_object:
        updated_object = await collection.update_one({"_id": ObjectId(object_id)}, {"$set": data})
        if updated_object:
            updated_object = await collection.find_one({"_id": ObjectId(object_id)})
            return helper(updated_object) if updated_object else False

async def remove(object_id: str) -> bool:
    deleted_object = await collection.find_one({"_id": ObjectId(object_id)})
    if deleted_object:
        await collection.delete_one({"_id": ObjectId(object_id)})
        return True
    return False