from schema.collections import CollectionsSchema


def collection_helper(data: CollectionsSchema) -> dict:
    return {
        'id': str(data['_id']),
        'title': data['title'],
        'owner': data['owner'],
        'articles': data['articles']
    }