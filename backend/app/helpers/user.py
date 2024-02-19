def user_helper(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "fullName": user["fullName"],
        "disabled": user["disabled"],
        "theme": user["theme"],
        "hashed_password": user["hashed_password"]
    }