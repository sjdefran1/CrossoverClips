from db.get_database import get_db
from json import dumps
from time import perf_counter

"""
Query Games Collection for given date
Returns tuple of all games that day

"""
def get_games_on_date_db(date: str, client) -> list:
    # Connect to Games Colelction
    start = perf_counter()
    #client = get_db()
    print("\nGetting SeasonsV2.Games")
    db = client['SeasonsV2']
    collection = db['Games']
    # Make Query, timing its execution
    print("Making query")
    # Generator for unpacking query results, then converted to tuple
    game_generator = (game for game in collection.find({'date':date}, projection={"_id": False}).hint([('date', 1)]))
    game_list = tuple(game_generator)
    end = perf_counter()
    print(f"Execution time for Query: {end - start:.6f} seconds\n")
    return game_list