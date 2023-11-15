from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from fastapi import Form
from pydantic import BaseModel, Field

from schema.files import FileScheme


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
    files: Optional[list[FileScheme]]