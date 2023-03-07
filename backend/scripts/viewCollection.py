import pymongo
from dotenv import load_dotenv
import os


load_dotenv()

MONGOPASS=os.getenv("MONGOPASS")

client = pymongo.MongoClient(f"mongodb+srv://sjdefran:{MONGOPASS}@nbaclips.h4kagx8.mongodb.net/?retryWrites=true&w=majority")

db = client['Seasons']


test_season = db['2022-23']

celtic_games = test_season.find({'TEAM_NAME':'Boston Celtics'})

for game in celtic_games:
    print(game['MATCHUP'] +" "+ game['WL'])