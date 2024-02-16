from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class Notebook(BaseModel):
    title: Optional[str] = Field(max_length=200)
    body: Optional[str] = Field(max_length=2000)

class NotebookWithOwner(Notebook):
    owner: str = Field(...)
    created: datetime = Field(...)
    changed: datetime = Field(...)


