import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional, Annotated

from fastapi import Form
from isbnlib import canonical, is_isbn10, is_isbn13
from pydantic import BaseModel, Field, validator, field_validator

from utils.classes import CustomDatetime


class Pages(BaseModel):
    start: Optional[int] = Field(None, gt=0, lt=999999)
    end: Optional[int] = Field(None, gt=0, lt=999999)

class PublicationDetails(BaseModel):
    year: Optional[Annotated[int, None]] = Field(None, gt=1800, lt=2100)
    title: Optional[str] = Field(None, max_length=300)
    pages: Optional[Pages] = Field(None)
    volume: Optional[str] = Field(None, max_length=100)
    issue: Optional[str] = Field(None, max_length=200)

class AuthorSchema(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    sur_name: Optional[str] = Field(None, max_length=100)

    @property
    def short_surname(self) -> str:
        return self.sur_name[0]+"." if self.sur_name else ""

    @property
    def short_firstname(self) -> str:
        return self.first_name[0]+"." if self.first_name is not None else ""

    @property
    def firstname(self) -> str:
        return self.first_name if self.first_name is not None else ""

    @property
    def lastname(self) -> str:
        return self.last_name if self.last_name is not None else ""

    @property
    def surname(self) -> str:
        return self.sur_name if self.sur_name is not None else ""

    def toLongString(self):
        return f'{self.firstname} {self.surname} {self.last_name}'

    def toShortString(self):
        return f'{self.lastname}, {self.short_firstname}{self.short_surname}'

    def toShortStringReverse(self):
        return f'{self.short_firstname}{self.short_surname} {self.lastname}'

class ArticleURLs(BaseModel):
    date_accessed: Optional[CustomDatetime]
    urls: Optional[list[str]] = Field(default=[], max_items=100)

    @field_validator('urls')
    def unique_url(cls, v):
        pattern = re.compile("^(http|https)://")
        for url in v:
            if not pattern.match(url):
                raise ValueError(f"Строчка '{url}' не похожа на ссылку")
        return list(set(v))

    @field_validator('date_accessed')
    def validate_date(cls, v: CustomDatetime):
        if not v:
            return None
        if v > datetime.now(timezone.utc):
            raise ValueError("Дата посещения не может быть в будущем")
        return v

@dataclass
class ArticleSchema:
    owner: str = Form(...)
    added: CustomDatetime = Form(...)
    file_name: str = Form(...)
    year: int = Form(...)
    title: str = Form(...)
    source: str = Form(...)
    reference_type: str = Form(...)

class EditorsSchema(BaseModel):
    last_name: Optional[str] = Field(None, max_length=100)
    first_name: Optional[str] = Field(None, max_length=100)
    sur_name: Optional[str] = Field(None, max_length=100)

class AdditionalInformationBook(BaseModel):
    edition: Optional[str] = Field(None, max_length=200)
    editors: Optional[list[EditorsSchema]] = Field(None, max_items=5)
    city: Optional[str] = Field(None, max_length=100)
    publisher: Optional[str] = Field(None, max_length=200)
    month: Optional[int] = Field(None, gt=0, lt=13)
    day: Optional[int] = Field(None, gt=0, lt=32)
    source: Optional[str] = Field(None, max_length=200)
    country: Optional[str] = Field(None, max_length=200)
    number: Optional[str] = Field(None, max_length=200)
    code: Optional[str] = Field(None, max_length=200)
    institution: Optional[str] = Field(None, max_length=200)
    departament: Optional[str] = Field(None, max_length=200)
    type: Optional[str] = Field(None, max_length=200)
    series: Optional[str] = Field(None, max_length=200)

    @property
    def City(self):
        return self.city if self.city else ""

class MetaScheme(BaseModel):
    title: Optional[str] = Field(max_length=1000)
    authors: Optional[list[str]] = Field(max_items=10)
    publisher: Optional[str] = Field(max_length=200)
    year: Optional[str] = Field(max_length=4, min_length=4)
    language: Optional[str] = Field(max_length=10)

class ISBN(BaseModel):
    value: Optional[str] = Field(min_length=10, max_length=17)
    meta: Optional[MetaScheme] = Field(None)

    @field_validator('value')
    def isbn_validate(cls, v):
        if v:
            isbn = canonical(v)
            if is_isbn13(isbn) or is_isbn10(isbn):
                return isbn
            raise ValueError('Не верный формат ISBN')
        return None


class Identifiers(BaseModel):
    isbn: ISBN

class ArticleInDB(BaseModel):
    owner: str = Field(...)
    added: CustomDatetime = Field(...)
    files: Optional[list[str]] = Field(default=[], min_items=0, max_items=100)
    publication: Optional[PublicationDetails] = Field(PublicationDetails())
    title: Optional[str] = Field(max_length=300)
    authors: Optional[list[AuthorSchema]] = Field(None, max_items=10)
    source: Optional[str] = Field(None, max_length=200)
    reference_type: int = Field(0)
    additional_information: Optional[AdditionalInformationBook] = Field(None)
    urls: Optional[ArticleURLs] = Field(None)
    identifiers: Optional[Identifiers] = Field(None)
    description: Optional[str] = Field(None, max_length=2999)
    deleted: Optional[bool] = Field(False)
    delete_date: Optional[CustomDatetime] = Field(None)
    favorite: Optional[bool] = Field(False)
    read: Optional[bool] = Field(False)
    read_date: Optional[CustomDatetime] = Field(None)
    notebooks: Optional[list[str]] = Field([])

    @field_validator('files')
    def unique_files_id(cls, v):
        if v:
            return list(set(v))
        else:
            return []

    def to_string(self, fmt: str = 'gost') -> str:
        match fmt:
            case 'gost':
                match self.reference_type:
                    case 1:
                        # ГОСТ - КНИГА
                        try:
                            author = self.authors[0]
                            author_area = f'{author.toShortString()}'
                        except IndexError:
                            author = author_area = 'АВТОР НЕ ЗАПОЛНЕН'

                        match len(self.authors):
                            case 1:
                                # КНИГА С ОДНИМ АВТОРОМ
                                output = f'{author_area} {self.title} / {author.toLongString()}.— ' \
                                         f'{self.additional_information.City}: {self.additional_information.publisher}, ' \
                                         f'{self.publication.year}.— {self.publication.pages.end} с.'
                                return ' '.join(output.split())
                            case 2:
                                authors = ', '.join([author.toShortStringReverse() for author in sorted(self.authors, key=lambda x: x.last_name)])
                                output = f'{author_area} {self.title} / {authors}.— ' \
                                         f'{self.additional_information.City}: {self.additional_information.publisher}, ' \
                                         f'{self.publication.year}.— {self.publication.pages.end} с.'
                                return ' '.join(output.split())
                            case 3:
                                authors = ', '.join([author.toShortStringReverse() for author in sorted(self.authors, key=lambda x: x.last_name)])
                                output = f'{author_area} {self.title} / {authors}.— ' \
                                         f'{self.additional_information.City}: {self.additional_information.publisher}, ' \
                                         f'{self.publication.year}.— {self.publication.pages.end} с.'
                                return ' '.join(output.split())
                            case 4:
                                authors = ', '.join([author.toShortStringReverse() for author in sorted(self.authors, key=lambda x: x.last_name)])
                                output = f'{self.title} / {authors}.— ' \
                                         f'{self.additional_information.City}: {self.additional_information.publisher}, ' \
                                         f'{self.publication.year}.— {self.publication.pages.end} с.'
                                return ' '.join(output.split())
                            case _:
                                authors = ', '.join([author.toShortStringReverse() for author in sorted(self.authors, key=lambda x: x.last_name)][:3])
                                output = f'{self.title} / {authors} [и др.].— ' \
                                         f'{self.additional_information.City}: {self.additional_information.publisher}, ' \
                                         f'{self.publication.year}.— {self.publication.pages.end} с.'
                                return ' '.join(output.split())


class NewArticleSchema(BaseModel):
    title: str = Field(max_length=200)
    files: Optional[list[str]] = Field(default=[], min_items=0, max_items=100)
    publication: Optional[PublicationDetails] = Field(PublicationDetails())
    authors: Optional[list[AuthorSchema]] = Field(None, max_items=10)
    source: Optional[str] = Field(None, max_length=200)
    reference_type: int = Field(0)
    additional_information: Optional[AdditionalInformationBook] = Field(None)
    urls: Optional[ArticleURLs] = Field(None)
    identifiers: Optional[Identifiers] = Field(None)
    description: Optional[str] = Field(None, max_length=2999)
    deleted: Optional[bool] = Field(False)
    delete_date: Optional[CustomDatetime] = Field(None)
    favorite: Optional[bool] = Field(False)
    read: Optional[bool] = Field(False)
    read_date: Optional[CustomDatetime] = Field(None)
    notebooks: Optional[list[str]] = Field([])


    @field_validator('files')
    def unique_files_id(cls, v):
        return list(set(v))


class UpdateArticleModel(BaseModel):
    publication: Optional[PublicationDetails] = Field(PublicationDetails())
    title: Optional[str]
    authors: Optional[list[AuthorSchema]]
    source: Optional[str]
    reference_type: Optional[int] = Field(0)
    additional_information: Optional[AdditionalInformationBook]
    files: Optional[list[str]] = Field(default=[], min_items=0, max_items=100)
    urls: Optional[ArticleURLs]
    identifiers: Optional[Identifiers]
    description: Optional[str] = Field(None, max_length=2999)
    deleted: Optional[bool]
    delete_date: Optional[CustomDatetime]
    favorite: Optional[bool]
    read: Optional[bool]
    read_date: Optional[CustomDatetime] = Field(None)
    notebooks: Optional[list[str]]

    @field_validator('publication')
    def publication_validate(cls, value):
        if not value:
            return PublicationDetails()
        return value