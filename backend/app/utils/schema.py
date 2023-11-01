from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

class HistoryBaseSchema(BaseModel):
    username: str = Field(...)
    query: str = Field(...)

class HistorySchema(HistoryBaseSchema):
    date: datetime

class AuthorSchema(BaseModel):
    first_name: str
    last_name: str

class ArticleSchema(BaseModel):
    owner: str = Field(...)
    added: datetime = Field(...)
    file: str
    year: int
    title: str
    source: str
    reference_type: str
    authors: AuthorSchema

class UserSchema(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    disabled: bool = Field(...)
    fullName: str = Field(...)
    theme: str

class UpdateUserModel(BaseModel):
    theme: Optional[str]
    email: Optional[EmailStr]

def ResponseModel(data: dict, message: str) -> dict:
    return {
        "data": [data],
        "code": 200,
        "message": message
    }

def ResponseHistoryModel(items: list, message: str) -> dict:
    return {
        "items": items,
        "code": 200,
        "message": message
    }

def ErrorResponseModel(error: str, code: int, message: str) -> dict:
    return {
        "error": error,
        "code": code,
        "message": message
    }

class User(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    joined: Optional[datetime] = None
    disabled: Optional[bool] = None
    theme: Optional[str] = 'light'

class UserInDB(UserSchema):
    hashed_password: str = Field(...)


class TokenData(BaseModel):
    username: Optional[str] = None

class Token(BaseModel):
    access: str
    refresh: str
    user: UserSchema
    token_type: str


class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    fullName: str
    disabled: Optional[bool] = None
    theme: Optional[str] = 'light'

