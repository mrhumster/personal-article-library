FROM tiangolo/uvicorn-gunicorn-fastapi:python3.11-slim AS builder
COPY ./requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt
COPY ./app /app
RUN mkdir -p /var/log/backend
WORKDIR /app
