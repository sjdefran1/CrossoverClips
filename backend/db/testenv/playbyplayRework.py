from json import dumps

from db.testenv.CreateTestDatabase import get_test_client
from db.playersController import get_playbyplay_games_collection

client = get_test_client()

def rework_of_playbyplay_array(document: dict) -> dict:
    new_plays_dict = {"FGM":{}, "AST":{}, "BLK":{}, "DUNK":{}, "STL":{}}
    current_plays_dict = document

    # iterate through plays.fgm, plays.blk, etc
    for stat_type in current_plays_dict:
        print(f"\t======== STARTING {stat_type} =============")
        new_dict = {} # going to be transform to be inserted
        plays = current_plays_dict[stat_type] # plays.fgm
        for play in plays:
            # print(f"\t{play['description']}")
            play['views'] = 0 # adding view column to each play
            url = play['url']
            new_dict.update({url: play})
        # update new_plays_dict in respective stat_type
        new_plays_dict[stat_type] = new_dict
    return new_plays_dict

def rework_all_playbyplay():
    collection = get_playbyplay_games_collection(client=client)
    results = collection.find(projection={"_id": False})

    for document in results:
        plays_arr = document['plays']
        game_id = document['game_id']
        print(f"++++++++++ Starting |{game_id}| ++++++++++ ")
        playbyplay_dict = rework_of_playbyplay_array(plays_arr)
        document['plays'] = playbyplay_dict # update plays array to new dict
        print(f"++++++++++ Finding |{game_id}| and Replacing ++++++++++ ")
        collection.find_one_and_replace({'game_id': game_id},\
                                         projection={'_id':False},\
                                         replacement=document) 


def how_many_failed():
    collection = get_playbyplay_games_collection(client=client)
    results = collection.find(projection={"_id": False})

    counter = 0
    for result in results:
        if type(result['plays']['FGM']) == list:
            counter = counter + 1
    print(counter)
if __name__=="__main__":
    # rework_all_playbyplay()
    how_many_failed()

    