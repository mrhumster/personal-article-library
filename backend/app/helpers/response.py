def ResponseModel(data: dict | list, message: str) -> dict:
    return {
        "data": [data] if type(data) == dict else data,
        "code": 200,
        "message": message
    }


def ErrorResponseModel(error: str, code: int, message: str) -> dict:
    return {
        "error": error,
        "code": code,
        "message": message
    }