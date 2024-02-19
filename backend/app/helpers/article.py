from uvicorn.main import logger


def additional_information_helper(information) -> dict:
    return {
        'edition': information['edition'],
        'editors': information['editors']
    }

def datetime_to_str(value) -> str:
    if value:
        return value.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    else:
        return value

def article_helper(article: dict) -> dict:
    return {
        "id": str(article["_id"]),
        "owner": article["owner"],
        "added": article["added"].strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
        "files": article["files"],
        "publication": article["publication"],
        "title": article["title"],
        "authors": article["authors"],
        "source": article["source"],
        "reference_type": int(article["reference_type"]),
        "additional_information": article["additional_information"],
        "urls": article.get('urls', None),
        "identifiers": article["identifiers"],
        "deleted": article["deleted"],
        "delete_date": article["delete_date"],
        "favorite": article["favorite"],
        "read": article["read"],
        "read_date": datetime_to_str(article['read_date']),
        "notebooks": article.get("notebooks",[])
    }

def isbn_meta_helper(meta) -> dict:
    return {
        'title': meta['Title'],
        'authors': meta['Authors'],
        'publisher': meta['Publisher'],
        'year': meta['Year'],
        'language': meta['Language']
    }