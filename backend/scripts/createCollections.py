import pymongo
from dotenv import load_dotenv
import os
from gameLog import parse_season_json



load_dotenv()

MONGOPASS=os.getenv("MONGOPASS")

client = pymongo.MongoClient(f"mongodb+srv://sjdefran:{MONGOPASS}@nbaclips.h4kagx8.mongodb.net/?retryWrites=true&w=majority")
# db = client['TestDatabase']

# collection = db['TestCollection']

# document = {
#     "name": "sam",
#     "id": "1010"
# }

# collection.insert_one(document)
year = '2021-22'

Seasons = client['Seasons']

collection = Seasons[year]

games = parse_season_json(year)

#print(games)
collection.insert_many(games)


# {
# gameid: "202020"
# date: "" 
# home: {}
# away: {}
# }