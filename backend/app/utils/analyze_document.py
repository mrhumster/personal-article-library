import logging

from schema.files import FileWithOwner
from utils.environment import Config
from utils.es import ElasticModel, readPDF, __prepareElasticModel__, __sendToElasticSearch__

UPLOADS = Config.UPLOADS
logging.basicConfig(filename='/var/log/backend/background_task.log', format='%(levelname)s:%(message)s', level=logging.INFO)

def prepare_for_es(file: FileWithOwner):
    file_path = f'{UPLOADS}{file.file_uuid}'
    line = readPDF(file_path)
    e_model = __prepareElasticModel__(line, file.file_uuid)
    __sendToElasticSearch__(e_model)
