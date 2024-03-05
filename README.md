# Personal Article Library

Прототип библиографического менеджера

## ElasticSearch pipline

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