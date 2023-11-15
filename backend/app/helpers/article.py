def additional_information_helper(information) -> dict:
    return {
        'edition': information['edition'],
        'editors': information['editors']
    }

def article_helper(article) -> dict:
    return {
        "id": str(article["_id"]),
        "owner": article["owner"],
        "added": article["added"],
        "files": article["files"],
        "publication": article["publication"],
        "title": article["title"],
        "authors": article["authors"],
        "source": article["source"],
        "reference_type": int(article["reference_type"]),
        "additional_information": article["additional_information"]
    }

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "fullName": user["fullName"],
        "disabled": user["disabled"],
        "theme": user["theme"],
        "hashed_password": user["hashed_password"]
    }