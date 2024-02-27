from datetime import datetime
from typing import Optional, Dict, List

from pydantic import BaseModel, Field, field_validator

class WasOpeningScheme(BaseModel):
    lastOpeningDate: datetime
    scale: float
    page: int

class FileHistoryScheme(BaseModel):
    wasOpening: Optional[Dict[str, WasOpeningScheme]]

class FileScheme(BaseModel):
    file_name: str = Field(...)
    file_uuid: str = Field(...)
    extension: str = Field(max_length=20)
    size: int = Field(lte=0)
    created: datetime
    history: Optional[FileHistoryScheme]

class FileWithOwner(FileScheme):
    owner: str = Field(max_length=100)