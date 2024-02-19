def collection_helper(data: dict) -> dict:
    return {
        'id': str(data['_id']),
        'title': data['title'],
        'owner': data['owner'],
        'articles': data['articles']
    }