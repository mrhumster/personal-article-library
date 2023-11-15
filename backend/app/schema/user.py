from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class UserSchema(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    disabled: bool = Field(...)
    fullName: str = Field(...)
    theme: str

class UpdateUserModel(BaseModel):
    theme: Optional[str]
    email: Optional[EmailStr]

class User(BaseModel):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    joined: Optional[datetime] = None
    disabled: Optional[bool] = None
    theme: Optional[str] = 'light'

class UserInDB(UserSchema):
    hashed_password: str = Field(...)


class TokenData(BaseModel):
    username: Optional[str] = None

class Token(BaseModel):
    access_token: str
    refresh: str
    user: UserSchema
    token_type: str


class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    fullName: str
    disabled: Optional[bool] = None
    theme: Optional[str] = 'light'
