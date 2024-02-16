from schema.notebook import NotebookWithOwner as modelSchema

def helper(data: modelSchema) -> dict:
    return {
        'id': str(data['_id']),
        'owner': data['owner'],
        'created': data['created'],
        'changed': data['changed'],
        'title': data['title'],
        'body': data['body']
    }