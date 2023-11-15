def ResponseModel(data: dict, message: str) -> dict:
    return {
        "data": [data],
        "code": 200,
        "message": message
    }


def ErrorResponseModel(error: str, code: int, message: str) -> dict:
    return {
        "error": error,
        "code": code,
        "message": message
    }