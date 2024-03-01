import logging
import PyPDF2
from elasticsearch import Elasticsearch
from pydantic import BaseModel

from schema.files import FileWithOwner
from utils.environment import Config

UPLOADS = Config.UPLOADS
logging.basicConfig(filename='/var/log/backend/es.log', format='%(levelname)s:%(message)s', level=logging.INFO)


class ElasticModel(BaseModel):
    file_uuid: str
    content: str
    page: int


def readPDF(path):
    pdf_file_obj = open(path, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
    array_with_extracted_text = []
    for page, content in enumerate(pdf_reader.pages):
        array_with_extracted_text.append(
            {
                "page": page,
                "content": content.extract_text().replace("\n", "")
            }
        )
    return array_with_extracted_text


def __prepareElasticModel__(content, file: FileWithOwner):
    model = {
        'page': content['page'],
        'content': content['content'],
        'file_uuid': file.file_uuid
    }
    model = ElasticModel.parse_obj(model)
    return model


def __sendToElasticSearch__(model: ElasticModel):
    client = Elasticsearch("http://es:9200")
    index = "pdf"
    model_id = f'{model.file_uuid}-{model.page}'
    data = model.json()
    client.index(index=index, id=model_id, document=data)
