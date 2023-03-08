from db.get_database import get_db
from json import dumps
from time import perf_counter

"""
Query Games Collection for given date
Returns tuple of all games that day

"""
def get_games_on_date_db(date: str) -> list:
    # Connect to Games Colelction
    print("Getting Database")
    client = get_db()
    db = client['SeasonsV2']
    collection = db['Games']

    # Make Query, timing its execution
    print("Making query")
    start = perf_counter()
    # Generator for unpacking query results, then converted to tuple
    game_generator = (game for game in collection.find({'date':date}, projection={"_id": False}).hint([('date', 1)]))
    game_list = tuple(game_generator)
    end = perf_counter()
    print(f"Execution time for tuple: {end - start:.6f} seconds")
    
    # start = perf_counter()
    # game_list = []
    # for game in collection.find({'date':date}, projection={"_id": False}).hint([('date', 1)]):
    #     #print(type(game))
    #     game_list.append(game)
    # end = perf_counter()
    # print(f"Execution time for loop appending to list: {end - start:.6f} seconds")
    #print(game_list)
    #print(dumps(game_list, indent=1))
    print("Finished Query")
    return game_list