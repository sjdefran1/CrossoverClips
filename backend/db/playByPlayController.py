
def insert_playByPlay_db(client, game):
    db = client['PlayByPlay']
    collection = db['Games']
    print(f"Inserting Play By Play for {game['game_id']}")
    collection.insert_one(game)
    return None

# returns playbyplay from database for gameID
def get_playByPlay_db(client, gameID, statType):
    db = client['PlayByPlay']
    collection = db['Games']
    print(f"Getting PlayByPlay for {gameID}")
    result = collection.find({'game_id':gameID}, projection={"_id": False})
    for game in result:
        # return only the current stat type information
        return_dic = {
            "game_id":game['game_id'],
            "players": game['players'][statType], # filter only players from stattype
            'plays': game['plays'][statType], # filter only plays from statype
            'team_ids': game['team_ids'],
            'number_quarters': game['number_quarters']
        }
        return return_dic
    
def check_playByPlay_exists(gameID, client) -> bool:
    db = client['PlayByPlay']
    collection = db['Games']

    if collection.find_one({'game_id': gameID}) is None:
        return False
    else:
        return True

