from typing import Optional

from pydantic import BaseModel, Field, field_validator


class CollectionsSchema(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    articles: Optional[list[str]] = []

    @field_validator('articles')
    def unique_articles_id(cls, v):
        return list(set(v))

class CollectionsSchemaWithOwner(CollectionsSchema):
    owner: str = Field(max_length=100)