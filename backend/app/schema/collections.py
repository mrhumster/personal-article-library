from typing import Optional
from pydantic import BaseModel, validator


class CollectionsSchema(BaseModel):
    title: Optional[str]
    articles: Optional[list[str]] = []

    @validator('articles')
    def unique_articles_id(cls, v):
        return list(set(v))

class CollectionsSchemaWithOwner(CollectionsSchema):
    owner: str