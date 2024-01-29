from datetime import datetime

from uvicorn.server import logger


def additional_information_helper(information) -> dict:
    return {
        'edition': information['edition'],
        'editors': information['editors']
    }

def article_helper(article) -> dict:
    logger.info(article['urls']['date_accessed'].strftime("%Y-%m-%dT%H:%M:%S.%fZ"))
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
        "urls": {
            "date_accessed": article['urls']['date_accessed'].strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
            "urls": article['urls']['urls']
        },
        "identifiers": article["identifiers"],
        "deleted": article["deleted"],
        "delete_date": article["delete_date"],
        "favorite": article["favorite"],
        "read": article["read"]
    }

def isbn_meta_helper(meta) -> dict:
    return {
        'title': meta['Title'],
        'authors': meta['Authors'],
        'publisher': meta['Publisher'],
        'year': meta['Year'],
        'language': meta['Language']
    }