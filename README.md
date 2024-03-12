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
          "attachment.content": {},
          "authors.first_name": {},
          "authors.last_name": {},
          "authors.sur_name": {}
        },
        "boundary_max_scan": 140,
        "fragment_size": 500
      }
    },
    "params": {
      "query_string": "My query string",
      "owner": "username"
    }
  }
}
```

### Шаблон для поиска автодополнений
```
PUT _scripts/pal-suggest-template
{
  "script": {
    "lang": "mustache",
    "source": {
      "suggest": {
        "song-suggest": {
          "prefix": "{{prefix}}",        
          "completion": {         
              "field": "{{fieldname}}"  
          }
        }
      },
      "_source": false
    },
    "params": {
      "prefix": "Мос",
      "fieldname": "additional_information.city"
    }
  }
}
```

### Мапинг для Articles
```shell
PUT /articles/
{
  "mappings": {
    "properties": {
      "added": {
        "type": "date"
      },
      "additional_information": {
        "properties": {
          "day": {
            "type": "long"
          },
          "edition": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "month": {
            "type": "long"
          },
          "publisher": {
            "type": "completion",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "city": {
            "type": "completion"
          }
        }
      },
      "authors": {
        "properties": {
          "first_name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "last_name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "sur_name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      },
      "deleted": {
        "type": "boolean"
      },
      "favorite": {
        "type": "boolean"
      },
      "files": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "id": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "identifiers": {
        "properties": {
          "isbn": {
            "properties": {
              "value": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              }
            }
          }
        }
      },
      "owner": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "publication": {
        "properties": {
          "pages": {
            "properties": {
              "end": {
                "type": "long"
              },
              "start": {
                "type": "long"
              }
            }
          },
          "title": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "year": {
            "type": "long"
          }
        }
      },
      "read": {
        "type": "boolean"
      },
      "read_date": {
        "type": "date"
      },
      "reference_type": {
        "type": "long"
      },
      "title": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```