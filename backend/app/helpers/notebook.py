def helper(data: dict) -> dict:
    return {
        'id': str(data['_id']),
        'owner': data['owner'],
        'created': data['created'],
        'changed': data['changed'],
        'title': data['title'],
        'body': data['body']
    }