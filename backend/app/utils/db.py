import collections

import motor.motor_asyncio
from bson.objectid import ObjectId
from uvicorn.main import logger

from utils.environment import Config
from utils.schema import ArticleInDB, User

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
user_collection = database.get_collection("users_collection")
article_collection = database.get_collection("articles_collection")
history_collection = database.get_collection("history_query")


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "fullName": user["fullName"],
        "disabled": user["disabled"],
        "theme": user["theme"],
        "hashed_password": user["hashed_password"]
    }

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

'''
Helper function for CRUD of Article object in MongoDB
'''
def additional_information_helper(information) -> dict:
    return {
        'edition': information['edition'],
        'editors': information['editors']
    }

def article_helper(article) -> dict:
    return {
        "id": str(article["_id"]),
        "owner": article["owner"],
        "added": article["added"],
        "file_name": article["file_name"],
        "file_uuid": article["file_uuid"],
        "publication": article["publication"],
        "title": article["title"],
        "authors": article["authors"],
        "source": article["source"],
        "reference_type": int(article["reference_type"]),
        "additional_information": article["additional_information"]
    }

async def add_article(article_data: ArticleInDB) -> dict:
    article = await article_collection.insert_one(article_data.dict())
    new_article = await article_collection.find_one({"_id": article.inserted_id})
    return article_helper(new_article)

async def retrieve_articles(user: User) -> list[dict]:
    articles = []
    async for article in article_collection.find({"owner": user['username']}):
        articles.append(article_helper(article))
    return articles

async def retrieve_article(article_id: str) -> dict | bool:
    article = await article_collection.find_one({"_id": ObjectId(article_id)})
    if article:
        return article_helper(article)
    return False

async def update_article(article_id: str, data: dict):
    if len(data) < 1:
        return False
    article = await article_collection.find_one({"_id": ObjectId(article_id)})

    if article:
        updated_article = await article_collection.update_one(
            {"_id": ObjectId(article_id)}, {"$set": data}
        )
        if updated_article:
            article = await article_collection.find_one({"_id": ObjectId(article_id)})
            return article_helper(article)
