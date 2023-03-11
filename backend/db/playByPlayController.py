
def insert_playByPlay_db(client, game):
    db = client['PlayByPlay']
    collection = db['Games']
    print(f"Inserting Play By Play for {game['game_id']}")
    collection.insert_one(game)
    return None

# returns playbyplay from database for gameID
def get_playByPlay_db(client, gameID):
    db = client['PlayByPlay']
    collection = db['Games']
    print(f"Getting PlayByPlay for {gameID}")
    result = collection.find({'game_id':gameID}, projection={"_id": False})
    for game in result:
        return game
    
def check_playByPlay_exists(gameID, client) -> bool:
    db = client['PlayByPlay']
    collection = db['Games']

    if collection.find_one({'game_id': gameID}) is None:
        return False
    else:
        return True

