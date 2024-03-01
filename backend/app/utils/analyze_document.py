import base64
import json
import logging
import cbor2
import requests
from schema.files import FileWithOwner
from utils.environment import Config
from utils.es import readPDF, __prepareElasticModel__, __sendToElasticSearch__

UPLOADS = Config.UPLOADS
logging.basicConfig(filename='/var/log/backend/background_task.log', format='%(levelname)s:%(message)s', level=logging.INFO)

def prepare_for_es(file: FileWithOwner):
    file_path = f'{UPLOADS}{file.file_uuid}'
    array_with_extracted_text = readPDF(file_path)
    for i in array_with_extracted_text:
        model = __prepareElasticModel__(i, file)
        __sendToElasticSearch__(model)


def add_pdf_to_es(file: FileWithOwner):
    file_path = f'{UPLOADS}{file.file_uuid}'
    headers = {'content-type': 'application/json'}
    with open(file_path, 'rb') as f:
        file_b64 = base64.b64encode(f.read())
        doc = {
            'data': file_b64.decode('utf-8')
        }
        resp = requests.put(
            f'http://es:9200/my-index-000001/_doc/{file.file_uuid}?pipeline=attachment',
            data=json.dumps(doc),
            headers=headers
        )
        logging.info(resp.text)
