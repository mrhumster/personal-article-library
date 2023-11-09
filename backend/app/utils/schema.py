from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from fastapi import Form
from pydantic import BaseModel, Field, EmailStr

class Pages(BaseModel):
    start: Optional[int]
    end: Optional[int]

class PublicationDetails(BaseModel):
    year: Optional[int]
    title: Optional[str]
    pages: Optional[Pages]
    volume: Optional[str]
    issue: Optional[str]

class AuthorSchema(BaseModel):
    first_name: str
    last_name: str

@dataclass
class ArticleSchema:
    owner: str = Form(...)
    added: datetime = Form(...)
    file_name: str = Form(...)
    year: int = Form(...)
    title: str = Form(...)
    source: str = Form(...)
    reference_type: str = Form(...)


class ArticleInDB(BaseModel):
    owner: str = Field(...)
    added: datetime = Field(...)
    file_name: str = Field(...)
    file_uuid: str = Field(...)
    publication: Optional[PublicationDetails]
    title: Optional[str]
    authors: list[AuthorSchema]
    source: Optional[str]
    reference_type: int = 0

class UpdateArticleModel(BaseModel):
    publication: Optional[PublicationDetails]
    title: Optional[str]
    authors: Optional[list[AuthorSchema]]
    source: Optional[str]
    reference_type: Optional[str]

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
    access_token: str
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

