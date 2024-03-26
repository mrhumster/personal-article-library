import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv('.env'))

DT_FORMAT = '%Y-%m-%dT%H:%M:%S.%fZ'

class Config:
    APP_PASSWORD = os.environ.get('APP_PASSWORD')
    SECRET_KEY = os.environ.get('SECRET_KEY', 'secret')
    ALGORITHM = os.environ.get('ALGORITHM', "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 10_080))  # one week
    MONGO_URI = os.environ.get('ME_CONFIG_MONGODB_URL', '')
    HOSTNAME = os.environ.get('REACT_APP_HOSTNAME', 'localhost')
    UPLOADS = os.environ.get('UPLOADS', '/tmp/uploads/')
    TZ = os.environ.get('TZ', 'Asia/Omsk')
    ES_URL = os.environ.get('ES_URL', "http://es:9200")
    MAPPINGS = {
        "articles": {
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
    }
