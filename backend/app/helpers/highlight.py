def helper(instance: dict) -> dict:
    return {
        "id": str(instance["_id"]),
        "highlightAreas": instance["highlightAreas"],
        "quote": instance["quote"],
        "content": instance["content"],
        "owner": instance["owner"],
        "file": instance["file"],
        "created": instance["created"],
        "changed": instance["changed"]
    }