from typing import Optional
from pydantic import BaseModel, validator


class CollectionsSchema(BaseModel):
    title: str
    articles: Optional[list[str]] = []

    @validator('articles')
    def unique_articles_id(self, v):
        return list(set(v))

class CollectionsSchemaWithOwner(CollectionsSchema):
    owner: str