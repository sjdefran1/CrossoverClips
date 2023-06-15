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

if __name__ == "__main__":
    # get_all_plays_by_player(1629023)
    print(pipeline_test(1628369) )# jt 

    #print(pipeline_test(2544)) # lbg