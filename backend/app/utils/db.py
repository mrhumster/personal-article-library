import collections

import motor.motor_asyncio
from bson.objectid import ObjectId
from uvicorn.main import logger

from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.users
user_collection = database.get_collection("users_collection")
history_collection = database.get_collection("history_query")


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "disabled": user["disabled"],
        "theme": user["theme"],
        "hashed_password": user["hashed_password"]
    }

def history_helper(history) -> dict:
    return {
        "id": str(history["_id"]),
        "username": history["username"],
        "query": history["query"],
        "date": history["date"]
    }

async def add_history_item(history_data: dict) -> dict:
    history = await history_collection.insert_one(history_data)
    new_history = await history_collection.find_one({"_id": history.inserted_id})
    return history_helper(new_history)

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

async def retrieve_history_item_by_username(username: str) -> list:
    history_items = []
    async for item in history_collection.find({"username": username}).sort("-date"):
        history_items.append(history_helper(item))

    unique = collections.OrderedDict()
    for elem in history_items:
        unique.setdefault(elem["query"], elem)
    return list(unique.values())[::-1][:5]


async def delete_history_by_username_and_query(username: str, query: str) -> bool:
    result = await history_collection.delete_many({'username': username, 'query': query})
    return True


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