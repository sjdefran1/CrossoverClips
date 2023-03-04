import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

MONGOPASS=os.getenv("MONGOPASS")

client = pymongo.MongoClient(f"mongodb+srv://sjdefran:{MONGOPASS}@nbaclips.h4kagx8.mongodb.net/?retryWrites=true&w=majority")
db = client['TestDatabase']

collection = db['TestCollection']

document = {
    "name": "sam",
    "id": "1010"
}

collection.insert_one(document)

