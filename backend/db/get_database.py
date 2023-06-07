import pymongo
from dotenv import load_dotenv
import os

def get_db_client_connection() -> pymongo.MongoClient:
    load_dotenv()
    # MONGOPASS = os.getenv("MONGOPASS")
    MONGOURL = os.getenv("MONGOURL")
    client = pymongo.MongoClient(MONGOURL)
    return client

