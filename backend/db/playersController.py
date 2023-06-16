from db.get_database import get_db_client_connection
from db.playByPlayController import get_playByPlay_db
from json import dumps
from time import perf_counter
client = get_db_client_connection()

def get_playbyplay_games_collection(client):
    db = client['PlayByPlay']
    return db['Games']


def get_all_plays_by_player(playerID: str):
    plays_collection = get_playbyplay_games_collection(client=client)
    # playerID = 1629023
    query = {
        "plays.FGM": {'$elemMatch': {'playerID': playerID}}
    }

    fgm = plays_collection.find(query, projection={"_id": False})

    for i, play in enumerate(fgm):
        # print(dumps(play, indent=1))
        with open("./test.txt", 'w') as f:
            f.write(dumps(play, indent=1))
        if i>1:
            break

def pipeline_test(playerID: str):
    start = perf_counter()
    plays_collection = get_playbyplay_games_collection(client=client)
    # Define the aggregation pipeline
    pipeline = [
        { "$unwind": "$plays.FGM" },  # Unwind the "plays" array
        { "$match": { "plays.FGM.playerID": playerID } },  # Filter the documents based on playerID
         {
        "$addFields": {
            "plays.FGM.game_id": "$game_id"  # Include the gameID field from the top of the document in each sub-dictionary
        }
    },
        { "$replaceRoot": { "newRoot": "$plays.FGM" } }  # Replace the root document with the matching "plays" element
    ]

    pipeline2 = [
    {
        '$project': {
            'game_id': 1, 
            'plays.FGM': 1
        }
    }, {
        '$unwind': {
            'path': '$plays.FGM'
        }
    }, {
        '$match': {
            'plays.FGM.playerID': playerID
        }
    }, {
        '$addFields': {
            'plays.FGM.game_id': '$game_id'
        }
    }, {
        '$replaceRoot': {
            'newRoot': '$plays.FGM'
        }
    }
]

    # Execute the aggregation pipeline
    result = plays_collection.aggregate(pipeline2)
    plays = []

    # iterate w/ cursor
    for doc in result:
        plays.append(doc)

    end = perf_counter()
    print(f"Execution time for Query: {end - start:.6f} seconds\n")
    return len(plays)


def get_certain_play(game_id, url, stat_type):
    collection = get_playbyplay_games_collection(client=client)
    
    mongo_pipeline_retrieve_views = [
        {
            '$match': {
                'game_id': game_id
            }
        },
        {
            '$project': {
                'game_id': 1,
                f'plays.{stat_type}': 1
            }
        },
        {
            '$unwind': {
                'path': f'$plays.{stat_type}'
            }
        },
        {
            '$match': {
                'plays.FGM.url': url
            }
        }
    ]

    view_count_response = collection.aggregate(mongo_pipeline_retrieve_views)
    for doc in view_count_response:
        found_highlight = doc
        break
    
    current_views = found_highlight['plays'][stat_type]['views']
    found_highlight['plays'][stat_type]['views'] = current_views + 1
    collection.find_one_and_replace({'game_id': found_highlight['game_id']},replacement=found_highlight)
    # collection.update_one({'game_id': found_highlight['game_id']}, update=found_highlight)
    # mongo_pipeline_set_views = [
    #     {
    #         '$match': {
    #             'game_id': game_id
    #         }
    #     }, 
    #     {
    #         '$project': {
    #             'game_id': 1, 
    #             f'plays.{stat_type}': 1
    #         }
    #     }, 
    #     {
    #         '$unwind': {
    #             'path': f'$plays.{stat_type}'
    #         }
    #     }, 
    #     {
    #         '$match': {
    #             'plays.FGM.url': url
    #         }
    #     },
    #     {
    #     '$set': {
    #         'plays.FGM.views': current_views + 1
    #         }
    #     }
    # ]

    # collection.aggregate(mongo_pipeline_set_views)

    return


def rework_of_playbyplay_document():
    collection = get_playbyplay_games_collection(client=client)
    res =collection.find_one({"game_id": "0022201133"}, projection={"_id": False})
    new_plays_dict = {"FGM":{}, "AST":{}, "BLK":{}, "DUNK":{}, "STL":{}}

    current_plays_dict = res['plays']

    # iterate through plays.fgm, plays.blk, etc
    for stat_type in current_plays_dict:
        new_dict = {} # going to be transform to be inserted
        plays = current_plays_dict[stat_type] # plays.fgm
        for play in plays:
            url = play['url']
            new_dict.update({url: play})
        with open('./test.txt', 'w') as f:
            f.write(dumps(new_dict, indent=1))
        break # temp

    



    print(dumps(res, indent=1))


    return

    
if __name__ == "__main__":
    # get_all_plays_by_player(1629023)
    #print(pipeline_test(1628369) )# jt 
    # get_certain_play(game_id="0022201134",\
    #                  url="https://videos.nba.com/nba/pbp/media/2023/03/28/0022201134/7/39d66fc0-8eb4-433a-451d-8f17632557f4_1280x720.mp4",\
    #                  stat_type='FGM')
    rework_of_playbyplay_document()


    
    #print(pipeline_test(2544)) # lbg