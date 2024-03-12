# Personal Article Library

Прототип библиографического менеджера

## ElasticSearch settings

Для работы поиска необходимо при инициализации необходимо создать:

1. Настройку для извлечения текста из PDF файлов
2. Шаблон поиска

### Attach pipeline
```
PUT _ingest/pipeline/attachment
{
  "description" : "Extract attachment information",
  "processors" : [
    {
      "attachment" : {
        "field" : "data",
        "remove_binary": false
        }
    }
  ]
}
```

### Шаблон поиска
```
PUT _scripts/pal-search-template
{
  "script": {
    "lang": "mustache",
    "source": {
      "query": {
        "bool": {
          "must": [
            {
              "simple_query_string": {
                "query": "{{query_string}}",
                "fields": [
                  "title",
                  "attachment.content",
                  "attachment.title",
                  "authors*",
                  "file_name"
                ],
                "default_operator": "and"
              }
            }
          ],
          "filter": [
              {"term": {"owner" : "{{owner}}"} }
            ]
        }
      },
      "_source": false,
      "fields": [
        "title",
        "attachment.title",
        "file_name",
        "extension",
        "articles",
        "owner"
      ],
      "highlight": {
        "fields": {
          "title": {},
          "file_name": {},
          "attachment.content": {"boundary_max_scan": 40},
          "authors.first_name": {},
          "authors.last_name": {},
          "authors.sur_name": {}
        }
      }
    },
    "params": {
      "query_string": "My query string",
      "owner": "username"
    }
  }
}
```