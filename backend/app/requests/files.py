import motor.motor_asyncio
from bson import ObjectId

from helpers.files import file_helper
from schema.files import FileWithOwner
from utils.environment import Config

client = motor.motor_asyncio.AsyncIOMotorClient(Config.MONGO_URI)
database = client.pal
files_collection = database.get_collection("files_collection")

async def add_file(data: FileWithOwner) -> dict:
    file = await files_collection.insert_one(data.dict())
    new_file = await files_collection.find_one({"_id": file.inserted_id})
    return file_helper(new_file)

async def retrieve_file(file_id: str) -> dict | bool:
    file = await files_collection.find_one({"_id": ObjectId(file_id)})
    return file_helper(file) if file else False