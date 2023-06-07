from scripts.schedule.gameLog import parse_season_json
from db.get_database import get_db

def update_all_seasons() -> None:
    print("Getting Databse")
    client = get_db()
    years = ['2022-23','2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15']
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

def update_current_season() -> None:
    print("Getting Databse")
    client = get_db()
    SeasonsV2 = client['SeasonsV2']
    collection = SeasonsV2['Games']
    print("Retrieved Database")

    print("Updating This Season")
    games = parse_season_json('2022-23', get_today=0)
    for game in games:
        #print(game)
        # see if already exists
        print(game['game_id'])
        if collection.find_one({'game_id': game['game_id']}) is None:
            print(f"{game['home_info']['MATCHUP']} Notin database, inserting...")
            collection.insert_one(game)
            print("Inserted")
        else:
            print(f"Updating {game['home_info']['MATCHUP']} ")
            collection.find_one_and_replace({"game_id": game['game_id']}, replacement=game)


    #collection.insert_many(games)
    print("Season Updated")
    return

def update_today(other_date_str='') -> None:
    print("Getting Databse")
    client = get_db()
    SeasonsV2 = client['SeasonsV2']
    collection = SeasonsV2['Games']
    print("Retrieved Database")
    games = parse_season_json('2022-23', get_today=1, date_str=other_date_str)
    for game in games:
        # If it doesn't exists insert it
        # Else find it and update it
        result = collection.find_one({'game_id': game['game_id']})
        if result is None:
            print(f"Inserting {game['home_info']['MATCHUP']}")
            collection.insert_one(game)
        else:
            game['views'] = result['views']
            print(f"Updating {game['home_info']['MATCHUP']}")
            collection.find_one_and_replace({"game_id": game['game_id']}, replacement=game)
    return

def add_view_field():
    client=get_db()
    SeasonsV2 = client['SeasonsV2']
    collection = SeasonsV2['Games']
    collection.update_many({}, {'$set': {'views': 0}})

if __name__ == '__main__':
    update_current_season()
    #update_all_seasons()
    #update_today('2023-03-22')
    #add_view_field()
    
