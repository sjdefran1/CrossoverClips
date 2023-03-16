from db.get_database import get_db
from json import dumps
from time import perf_counter

def get_games_db(client):
    db = client['SeasonsV2']
    collection = db['Games']
    return collection



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

def get_games_by_team_db(team_id: str, season: str, client) -> list:
    start = perf_counter()
    print(f"Getting games by team | {team_id} |")
    collection = get_games_db(client=client)
    index_name = 'home_info.TEAM_ID_1_away_info.TEAM_ID_1'
    query = {"$or":[ {'home_info.TEAM_ID': team_id}, \
                     {'away_info.TEAM_ID': team_id}]}
    
    results = collection.find(query, projection={"_id": False}).hint(index_name).sort("date", -1)

    games = []
    for res in results:
        if season == '':
            games.append(res)
        elif res['season_str'] == season:
            print(res['date'] + " " + res['home_info']['MATCHUP'])
            games.append(res)
    end = perf_counter()
    print(f'Execution Time for Games by team: {end-start} | {team_id}')
    return games

if __name__ == '__main__':
    client = get_db()
    get_games_by_team_db(client=client, team_id=1610612739, season='2021-22')
    #get_games_on_date_db(client=client, date='2023-03-14')



