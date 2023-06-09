from json import dumps
from time import perf_counter

from db.get_database import get_db_client_connection

def get_games_db(client):
    db = client['SeasonsV2']
    collection = db['Games']
    return collection

def get_game_by_id_db(game_id: str, client):
    db = client['SeasonsV2']
    collection = db['Games']
    return collection.find_one({'game_id': game_id}, projection={"_id": False})

def get_games_on_date_db(date: str, client) -> list:
    """
    Query Games Collection for given date\n
    Returns tuple of all games that day

    """
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

def get_games_by_team_db(team_id: str, client, game_type: str, seasons=[]) -> list:
    start = perf_counter()
    print(f"Getting games by team | {team_id} |")
    collection = get_games_db(client=client)
    index_name = 'home_info.TEAM_ID_1_away_info.TEAM_ID_1'
    query = {"$or":[ {'home_info.TEAM_ID': team_id}, \
                     {'away_info.TEAM_ID': team_id}]}
    
    results = collection.find(query, projection={"_id": False}).hint(index_name).sort("date", -1)
    # games = []
    # for res in results:
    #     if seasons == []:
    #         games.append(res)
    #     elif res['season_str'] in seasons:
    #         games.append(res)
    games = get_games_by_options(results=results,game_type=game_type, seasons=seasons)
    end = perf_counter()
    print(f'Execution Time for Games by team: {end-start} | {team_id}')
    return games

def get_games_by_matchup_db(team_ids: list, client, game_type: str, seasons=[]):
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
    # games=[]
    games = get_games_by_options(results=results, game_type=game_type, seasons=seasons)
    return games
    # for result in results:
    #     # no specific season requested
    #     if seasons == []:
    #         # if game_type is playoffs
    #         # return only games that have a playoff flag of 1
    #         if game_type == 'playoffs' and result['playoff_flag'] == 1:
    #             games.append(result)
    #             continue
    #         # if game type is regular season
    #         # only return games that have a playoff flag of 0
    #         if game_type == 'regular season' and result['playoff_flag'] == 0:
    #             games.append(result)
    #             continue
    #         games.append(result)
    #     # only return games from one of requested seasons
    #     elif result['season_str'] in  seasons:
    #         if game_type == 'playoffs' and result['playoff_flag'] == 1:
    #             games.append(result)
    #             continue
    #         if game_type == 'regular season' and result['playoff_flag'] == 0:
    #             games.append(result)
    #             continue
    #         games.append(result)
    # return games
 

def get_games_by_options(results: list, game_type: str, seasons: list) -> list:
    """
    Loops through results and filters them down by requirements\n

    *Could remove this logic w/ better mongo queries but this works for now*
    """
    games = []
    for result in results:
        # no specific season requested
        if seasons == []:
            # '' means all games, append and continue
            if game_type == '':
                games.append(result)
                continue
            # if game_type is playoffs
            # return only games that have a playoff flag of 1
            if game_type == 'playoffs' and result['playoff_flag'] == 1:
                games.append(result)
                continue
            # if game type is regular season
            # only return games that have a playoff flag of 0
            elif game_type == 'regular season' and result['playoff_flag'] == 0:
                games.append(result)
                continue
            # no requirements, append game
            else:
                games.append(result)

        # only return games from one of requested seasons
        elif result['season_str'] in  seasons:
            # same logic as above
            if game_type == '':
                games.append(result)
                continue
            if game_type == 'playoffs' and result['playoff_flag'] == 1:
                games.append(result)
                print("I'm still here dog")
                continue
            elif game_type == 'regular season' and result['playoff_flag'] == 0:
                games.append(result)
                continue
           
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
    collection = get_games_db(client=client)
    results = collection.find({"season_str": season}, projection={"_id": False}).sort('date', -1)
    games = []
    for result in results:
        games.append(result)
    return games


# one time function to add playoff_flags to regular season games set to 0
def add_playoff_flag_to_non_playoff_games(client):
    collection = get_games_db(client=client)
    results = collection.find(projection={"_id": False})
    for result in results:
        id = result['game_id']
        # throws error if it doesn't have playoff flag
        try:
            flag_test = result['playoff_flag']
            print(result['away_info']['MATCHUP'])
        except:
            print(f"updating {id} playoff flag")
            collection.update_one({'game_id': id}, {'$set': {'playoff_flag': 0}})


if __name__ == '__main__':
    client = get_db_client_connection()
    add_playoff_flag_to_non_playoff_games(client=client)




