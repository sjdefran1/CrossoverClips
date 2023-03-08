import pymongo
from dotenv import load_dotenv
import os
from scripts.gameLog import parse_season_json
from db.get_database import get_db


def update_all_seasons():
    print("Getting Databse")
    client = get_db()
    years = ['2022-23','2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17']
    #Seasons = client['Seasons']

    # for year in years:
    #     print(f'Starting {year}')
    #     collection = Seasons[year]
    #     games = parse_season_json(year)
    #     collection.insert_many(games)
    #     print(f'Inserted {year}')

    SeasonsV2 = client['SeasonsV2']
    collection = SeasonsV2['Games']
    print("Retrieved Database")
    
    print("Updating Seasons")
    games = []
    for year in years:
        print(f'Starting {year}')
        games.extend(parse_season_json(year))
        print(f'Gathered {year}')

    collection.insert_many(games)
    return

def update_current_season():
    print("Getting Databse")
    client = get_db()
    SeasonsV2 = client['SeasonsV2']
    collection = SeasonsV2['Games']
    print("Retrieved Database")

    print("Updating This Season")
    games = parse_season_json('2022-23', today=1)
    collection.insert_many(games)
    print("Season Updated")
    return

if __name__ == '__main__':
    update_current_season()
    
