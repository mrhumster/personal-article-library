import motor.motor_asyncio
from bson import ObjectId

from helpers.article import user_helper
from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
user_collection = database.get_collection("users_collection")


async def retrieve_users():
    users = []
    async for user in user_collection.find():
        users.append(user_helper(user))
    return users

async def add_user(user_data: dict) -> dict:
    user = await user_collection.insert_one(user_data)
    new_user = await user_collection.find_one({"_id": user.inserted_id})
    return user_helper(new_user)

async def retrieve_user(username: str) -> dict:
    user = await user_collection.find_one({"username": username})
    if user:
        return user_helper(user)

async def retrieve_user_by_name(username: str) -> dict | bool:
    user = await user_collection.find_one({"username": username})
    if user:
        return user_helper(user)
    return False


async def update_user(username: str, data: dict):
    if len(data) < 1:
        return False
    user = await user_collection.find_one({"username": username})
    if user:
        updated_user = await user_collection.update_one(
            {"username": username}, {"$set": data}
        )
        if updated_user:
            return True
        return False

async def delete_user(id: str):
    user = await user_collection.find_one({"_id": ObjectId(id)})
    if user:
        await user_collection.delete_one({"_id": ObjectId(id)})
        return True

async def get_user(username: str) -> dict | bool:
    user = await user_collection.find_one({"username": username})
    if user:
        return user_helper(user)
    return False