import re
from isbnlib import canonical, is_isbn10, is_isbn13, meta
from dataclasses import dataclass
from datetime import datetime, date, timezone
from typing import Optional

from fastapi import Form
from pydantic import BaseModel, Field, validator
from uvicorn.main import logger

from helpers.article import isbn_meta_helper


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
    first_name: Optional[str] = Field(max_length=100)
    last_name: Optional[str] = Field(max_length=100)
    sur_name: Optional[str] = Field(max_length=100)

class ArticleURLs(BaseModel):
    date_accessed: Optional[datetime]
    urls: Optional[list[str]] = Field(max_items=100)

    @validator('urls')
    def unique_url(cls, v):
        pattern = re.compile("^(http|https)://")
        for url in v:
            if not pattern.match(url):
                raise ValueError(f"Строчка '{url}' не похожа на ссылку")
        return list(set(v))

    @validator('date_accessed')
    def validate_date(cls, v: datetime):
        if not v:
            raise ValueError("Не корректная дата")
        if v > datetime.now(timezone.utc):
            raise ValueError("Дата посещения не может быть в будущем")
        return v

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

class MetaScheme(BaseModel):
    title: Optional[str] = Field(max_length=1000)
    authors: Optional[list[str]] = Field(max_items=10)
    publisher: Optional[str] = Field(max_length=200)
    year: Optional[str] = Field(max_length=4, min_length=4)
    language: Optional[str] = Field(max_length=10)

class ISBN(BaseModel):
    isbn13: Optional[str] = Field(max_length=13, min_length=13)
    isbn10: Optional[str] = Field(max_length=10, min_length=10)
    meta: Optional[MetaScheme]

    @validator('isbn13')
    def isbn13_validate(cls, v):
        isbn = canonical(v)
        if not is_isbn13(isbn):
            raise ValueError('Не верный формат ISBN')
        data = meta(isbn)
        logger.info(isbn_meta_helper(data))
        return v

class Identifiers(BaseModel):
    isbn: ISBN

class ArticleInDB(BaseModel):
    owner: str = Field(...)
    added: datetime = Field(...)
    files: Optional[list[str]]
    publication: Optional[PublicationDetails]
    title: Optional[str] = Field(max_length=300)
    authors: Optional[list[AuthorSchema]] = Field(max_items=5)
    source: Optional[str] = Field(max_length=200)
    reference_type: int = 0
    additional_information: Optional[AdditionalInformationBook]
    urls: Optional[ArticleURLs]
    identifiers: Optional[Identifiers]

    @validator('files')
    def unique_files_id(cls, v):
        return list(set(v))


class NewArticleSchema(BaseModel):
    title: str = Field(max_length=200)
    files: Optional[list[str]]

    @validator('files')
    def unique_files_id(cls, v):
        return list(set(v))


class UpdateArticleModel(BaseModel):
    publication: Optional[PublicationDetails]
    title: Optional[str]
    authors: Optional[list[AuthorSchema]]
    source: Optional[str]
    reference_type: Optional[str]
    additional_information: Optional[AdditionalInformationBook]
    files: Optional[list[str]]
    urls: Optional[ArticleURLs]
    identifiers: Optional[Identifiers]