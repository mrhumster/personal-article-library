from typing import List

from pydantic import BaseModel, Field
from utils.classes import CustomDatetime


class HighlightArea(BaseModel):
    height: float
    left: float
    pageIndex: int
    top: float
    width: float

class HighlightScheme(BaseModel):
    content: str
    quote: str
    highlightAreas: List[HighlightArea]
    file: str = Field(...)

class HighlightWithOwnerScheme(HighlightScheme):
    owner: str = Field(...)
    created: CustomDatetime
    changed: CustomDatetime