import pymongo
from dotenv import load_dotenv
import os
from scripts.gameLog import parse_season_json

load_dotenv()

MONGOPASS=os.getenv("MONGOPASS")

client = pymongo.MongoClient(f"mongodb+srv://sjdefran:{MONGOPASS}@nbaclips.h4kagx8.mongodb.net/?retryWrites=true&w=majority")
years = ['2022-23', '2019-20', '2018-19', '2017-18', '2016-17']
Seasons = client['Seasons']

# for year in years:
#     print(f'Starting {year}')
#     collection = Seasons[year]
#     games = parse_season_json(year)
#     collection.insert_many(games)
#     print(f'Inserted {year}')

SeasonsV2 = client['SeasonsV2']
collection = SeasonsV2['Games']

games = []
for year in years:
    print(f'Starting {year}')
    games.extend(parse_season_json(year))
    print(f'Gathered {year}')

collection.insert_many(games)