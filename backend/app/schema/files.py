from datetime import datetime
from pydantic import BaseModel, Field

class FileScheme(BaseModel):
    file_name: str = Field(...)
    file_uuid: str = Field(...)
    extension: str = Field(max_length=20)
    size: int = Field(lte=0)
    created: datetime

class FileWithOwner(FileScheme):
    owner: str = Field(max_length=100)