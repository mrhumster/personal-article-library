from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from fastapi import Form
from pydantic import BaseModel, Field, EmailStr


class Pages(BaseModel):
    start: Optional[int] = Field(gt=0, lt=999999)
    end: Optional[int] = Field(gt=0, lt=999999)

class PublicationDetails(BaseModel):
    year: Optional[int] = Field(gt=1900, lt=2100)
    title: Optional[str] = Field(max_length=300)
    pages: Optional[Pages]
    volume: Optional[str] = Field(max_length=100)
    issue: Optional[str] = Field(max_length=200)

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

class EditorsSchema(BaseModel):
    last_name: Optional[str] = Field(max_length=100)
    first_name: Optional[str] = Field(max_length=100)
    sur_name: Optional[str] = Field(max_length=100)

class AdditionalInformationBook(BaseModel):
    edition: Optional[str] = Field(max_length=200)
    editors: Optional[list[EditorsSchema]] = Field(max_items=5)
    city: Optional[str] = Field(max_length=100)
    publisher: Optional[str] = Field(max_length=200)
    month: Optional[int] = Field(gt=0, lt=13)
    day: Optional[int] = Field(gt=0, lt=32)

class FileScheme(BaseModel):
    file_name: str = Field(...)
    file_uuid: str = Field(...)
    extension: str = Field(max_length=20)
    size: int = Field(lte=0)
    created: datetime

class ArticleInDB(BaseModel):
    owner: str = Field(...)
    added: datetime = Field(...)
    files: Optional[list[FileScheme]]
    publication: Optional[PublicationDetails]
    title: Optional[str] = Field(max_length=300)
    authors: list[AuthorSchema] = Field(max_items=5)
    source: Optional[str] = Field(max_length=200)
    reference_type: int = 0
    additional_information: Optional[AdditionalInformationBook]


class UpdateArticleModel(BaseModel):
    publication: Optional[PublicationDetails]
    title: Optional[str]
    authors: Optional[list[AuthorSchema]]
    source: Optional[str]
    reference_type: Optional[str]
    additional_information: Optional[AdditionalInformationBook]

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

