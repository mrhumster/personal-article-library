from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from uvicorn.server import logger

from authorisation.auth import authenticate_user, create_access_token, create_password_hash, get_current_active_user
from helpers.response import ResponseModel, ErrorResponseModel
from db_requests.user import add_user, retrieve_user, retrieve_users, update_user, get_user
from schema.user import UserSchema, User, UpdateUserModel, Token, UserRegister
from utils.environment import Config

router = APIRouter()


@router.post("/", response_description="Новый пользователь добавлен в базу")
async def add_user_data(user: UserSchema = Body(...)):
    user = jsonable_encoder(user)
    new_user = await add_user(user)
    return ResponseModel(new_user, "Пользователь добавлен")

@router.get("/", response_description="Пользователи")
async def get_users(current_user: User = Depends(get_current_active_user)):
    users = await retrieve_users()
    if users:
        return ResponseModel(users, 'Пользователи успешно доставлены')
    return ResponseModel(users, 'Пустой список')

@router.get("/{username}", response_description='Пользователь')
async def get_user_data(username: str):
    user = await retrieve_user(username)
    logger.info(user)
    if user:
        user.pop('hashed_password')
        return ResponseModel(user, 'Пользователь успешно доставлен')
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Пользователь не найден. Для регистрации укажите адрес электронной почты.',
        headers={'WWW-Authenticate': 'Bearer'}
    )

@router.put("/{username}")
async def update_user_data(username: str, req: UpdateUserModel = Body(...), current_user: User = Depends(get_current_active_user)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    updated_student = await update_user(username, req)
    if updated_student:
        return ResponseModel(
            {"detail": f"User with ID: {username} name update is successful"},
            "User name updated successfully",
        )
    return ErrorResponseModel(
        "An error occurred",
        404,
        "There was an error updating the student data.",
    )


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Пользователь не авторизован',
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "refresh": "Sorry, this method not implement", "user": user, "token_type": "bearer"}

@router.post("/create", response_model=Token)
async def create_user(register_form: UserRegister):
    attributes = {
        'username': register_form.username,
        'hashed_password': create_password_hash(register_form.password),
        'joined': str(datetime.now(timezone.utc)),
        'email': register_form.email,
        'fullName': register_form.fullName,
        'disabled': register_form.disabled,
        'theme': register_form.theme
    }

    check_users = await get_user(attributes['username'])

    if check_users:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                'error': f'Пользователь с именем "{register_form.username}" уже существует.'
            },
            headers={'WWW-Authenticate': 'Bearer'}
        )

    await add_user(attributes)
    user = await authenticate_user(register_form.username, register_form.password)
    access_token_expires = timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "refresh": "Sorry, this method not implement",
        "user": user,
        "token_type": "bearer"
    }