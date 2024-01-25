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
        "additional_information": article["additional_information"],
        "urls": article["urls"],
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