from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from utils.classes import CustomDatetime
from utils.environment import Config
import pytz


class Notebook(BaseModel):
    title: Optional[str] = Field(max_length=500)
    body: Optional[str] = Field(max_length=2000)

class NotebookWithOwner(Notebook):
    owner: str = Field(...)
    created: CustomDatetime
    changed: CustomDatetime


