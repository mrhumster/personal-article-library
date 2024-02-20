import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv('.env'))

DT_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'

class Config:
    APP_PASSWORD = os.environ.get('APP_PASSWORD')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'secret')
    ALGORITHM = os.environ.get('ALGORITHM', "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 10_080))  # one week
    MONGO_URI = os.environ.get('ME_CONFIG_MONGODB_URL', '')
    HOSTNAME = os.environ.get('REACT_APP_HOSTNAME', 'localhost')
    UPLOADS = os.environ.get('UPLOADS', '/tmp/uploads/')
    TZ = os.environ.get('TZ', 'Asia/Omsk')
