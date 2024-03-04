import motor.motor_asyncio
from bson import ObjectId
from uvicorn.server import logger

from db_requests.files import files_collection
from helpers.article import article_helper
from helpers.files import file_helper
from schema.article import ArticleInDB
from schema.user import User
from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
article_collection = database.get_collection("articles_collection")
collections = database.get_collection("collections")

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

async def delete_article_perm(article_id: str):
    article = await article_collection.find_one({"_id": ObjectId(article_id)})
    if article:
        collections_with_this_article = []
        async for collection in collections.find({"articles": { "$in" : [article_id]} }):
            collections_with_this_article.append(collection['_id'])

        for collection in collections_with_this_article:
            await collections.update_one({"_id": collection}, {"$pull": {"articles": article_id}})

        await article_collection.delete_one({"_id": ObjectId(article_id)})
        return True
    return False