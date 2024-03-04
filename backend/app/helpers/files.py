def file_helper(file: dict) -> dict:
    return {
        "id": str(file["_id"]),
        "file_name": file["file_name"],
        "file_uuid": file["file_uuid"],
        "extension": file["extension"],
        "size": file["size"],
        "created": file["created"],
        "owner": file["owner"],
        "history": file["history"] if "history" in file else None,
        "articles": file["articles"] if "articles" in file else None,
    }