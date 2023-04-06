from db.gamesController import get_games_by_season
from db.get_database import get_db
from scripts.playByPlayV2.playByPlayV2Handler import get_all_stats_V2, getPlayByPlayV2Json, playByPlayV2Urls
from time import sleep

def insert_playByPlay_db(client, game):
    db = client['PlayByPlay']
    collection = db['Games']
    if game['number_quarters'] is None:
        print(f"No Highlight information for |{game['game_id']}| yet, not inserting.")
        return None
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

def createPlayByPlay_all_seasons(seasons: list):
    for season in seasons:
        print("Starting " + season)
        print("-" * 50)
        createPlayByPlay_for_season(season=season)
        print("Finished Season " + season)
        print("-" * 50)


def createPlayByPlay_for_season(season: str):
    client = get_db()
    games = get_games_by_season(season=season, client=client)
    i = 0
    for game in games:
        if(check_playByPlay_exists(gameID=game['game_id'], client=client)):
            print("game exists")
            i+=1
            continue
        print(f"Starting | {game['game_id']} | {game['away_info']['MATCHUP']} | {game['date']} | {i+1}/{len(games)}")
        response = getPlayByPlayV2Json(game_id=game['game_id'])
        split_date = game['date'].split('-')
        #print(split_date)
        fgm = playByPlayV2Urls(game_id=game['game_id'], y=split_date[0], d=split_date[2], m=split_date[1], stat_type='FGM', response=response)
        complete_playbyplay_dic = get_all_stats_V2(gameID=game['game_id'], response=response, fgm=fgm,  y=split_date[0], d=split_date[2], m=split_date[1])
        #print(complete_playbyplay_dic)
        print("\tInserting Game")
        insert_playByPlay_db(game=complete_playbyplay_dic, client=client)
        print("\tFinished Insert")
        print(f"Finished | {game['game_id']} | {game['away_info']['MATCHUP']}\n")
        i+=1




if __name__ == '__main__':
    #createPlayByPlay_for_season('2022-23')
    #createPlayByPlay_all_seasons(['2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17', '2015-16', '2014-15'])
    createPlayByPlay_all_seasons([ '2017-18', '2016-17', '2015-16', '2014-15'])