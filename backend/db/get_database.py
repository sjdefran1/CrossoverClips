import pymongo
from dotenv import load_dotenv
import os

def get_db():
    load_dotenv()
    MONGOPASS = os.getenv("MONGOPASS")
    client = pymongo.MongoClient(f"mongodb+srv://sjdefran:{MONGOPASS}@nbaclips.h4kagx8.mongodb.net/?retryWrites=true&w=majority")
    return client

