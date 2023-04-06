from db.get_database import get_db
from json import dumps
from time import perf_counter


def get_games_db(client):
    db = client['SeasonsV2']
    collection = db['Games']
    return collection


def get_game_by_id(game_id: str, client):
    db = client['SeasonsV2']
    collection = db['Games']
    return collection.find_one({'game_id': game_id}, projection={"_id": False})


"""
Query Games Collection for given date
Returns tuple of all games that day

"""
def get_games_on_date_db(date: str, client) -> list:
    # Connect to Games Colelction
    start = perf_counter()
    #client = get_db()
    print("\nGetting SeasonsV2.Games")
    collection = get_games_db(client=client)
    # Make Query, timing its execution
    print("Making query")
    # Generator for unpacking query results, then converted to tuple
    game_generator = (game for game in collection.find({'date':date}, projection={"_id": False}).hint([('date', 1)]))
    game_list = tuple(game_generator)
    end = perf_counter()
    print(f"Execution time for Query: {end - start:.6f} seconds\n")
    return game_list

def get_games_by_team_db(team_id: str, client, seasons=[]) -> list:
    start = perf_counter()
    print(f"Getting games by team | {team_id} |")
    collection = get_games_db(client=client)
    index_name = 'home_info.TEAM_ID_1_away_info.TEAM_ID_1'
    query = {"$or":[ {'home_info.TEAM_ID': team_id}, \
                     {'away_info.TEAM_ID': team_id}]}
    
    results = collection.find(query, projection={"_id": False}).hint(index_name).sort("date", -1)

    games = []
    for res in results:
        if seasons == []:
            games.append(res)
        elif res['season_str'] in seasons:
            #print(res['date'] + " " + res['home_info']['MATCHUP'])
            games.append(res)
    end = perf_counter()
    print(f'Execution Time for Games by team: {end-start} | {team_id}')
    return games

def get_games_by_matchup_db(team_ids: list, client, seasons=[]):
    start = perf_counter()
    collection = get_games_db(client=client)
    # home id=teamid[0] & away id=teamid[1] 
    # OR
    # homeid=teamid[1] and awayid=teamid[0]
    query = {
    "$or": [
        {"home_info.TEAM_ID": team_ids[0], "away_info.TEAM_ID": team_ids[1]},
        {"home_info.TEAM_ID": team_ids[1], "away_info.TEAM_ID": team_ids[0]}
        ]
    }

    results = collection.find(query, projection={"_id": False}).sort('date', -1)   
    games=[]
    for result in results:
        if seasons == []:
            games.append(result)
        elif result['season_str'] in  seasons:
            games.append(result)
        #print(result['home_info']['MATCHUP'] + ' ' + result['date'])
    return games

def update_game_view_count_db(game_id: str, client):
    collection = get_games_db(client=client)
    document = collection.find_one({'game_id': game_id})
    # Get the current view count and increment it by one
    view_count = document.get('views', 0) + 1
    # Update the document with the new view count
    collection.update_one({'game_id': game_id}, {'$set': {'views': view_count}})
    return


def get_games_by_season(season: str, client) -> list:
    #client = get_db()
    collection = get_games_db(client=client)
    results = collection.find({"season_str": season}, projection={"_id": False}).sort('date', -1)
    games = []
    for result in results:
        games.append(result)
    return games



        

if __name__ == '__main__':
    client = get_db()
    #get_games_by_team_db(client=client, team_id=1610612739, season='2021-22')
    #get_games_by_matchup_db(client=client, team_ids=[1610612739, 1610612738])
    #get_games_on_date_db(client=client, date='2023-03-14')



