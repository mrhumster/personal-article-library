import logging

import PyPDF2
import re

from pydantic import BaseModel

import requests
import json
import os
from datetime import date

from utils.environment import Config

UPLOADS = Config.UPLOADS
logging.basicConfig(filename='/var/log/backend/es.log', format='%(levelname)s:%(message)s', level=logging.INFO)


class ElasticModel1(BaseModel):
    name: str
    msg: str

class ElasticModel:

    name = ""
    msg = ""

    def toJSON(self):
        return json.dumps(self, sort_keys=True, indent=4)

def readPDF(path):
    pdf_file_obj = open(path, 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
    page_obj = pdf_reader.pages[0]
    line = page_obj.extract_text()
    line = line.replace("\n","")
    return line


#line = pageObj.extractText()

def __prepareElasticModel__(line, name):
    model = {'name': name, 'msg': line}
    model = ElasticModel1.parse_obj(model)
    return model


def __sendToElasticSearch__(elasticModel: ElasticModel1):
    print("Name : " + str(elasticModel))

############################################
####  #CHANGE INDEX NAME IF NEEDED
#############################################
    index = "articles_pdf"

    url = "http://es:9200/" + index +"/_doc?pretty"
    data = elasticModel.json()
    #data = serialize(eModel)
    response = requests.post(url, data=data, headers={
                    'Content-Type':'application/json',
                    'Accept-Language':'en'
                })
    logging.info("Url : " + url)
    logging.info("Data : " + str(data))

    logging.info("Request : " + str(requests))
    logging.info("Response : " + str(response))
