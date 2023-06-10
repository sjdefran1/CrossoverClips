"""
Backend server
"""

# fast api
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# my scripts
from db.gamesController import get_game_by_id_db, get_games_on_date_db, get_games_by_team_db, get_games_by_matchup_db, update_game_view_count_db
from db.get_database import get_db_client_connection
from db.teamsController import get_teams
from db.playByPlayController import get_playByPlay_db
from requestModels import DateStr, PlayByPlayStr, TeamSearch, ViewCount
from api_helpers import fix_date_db


# Global Var
# ---------------
# db client, improves query time instead of reestablishing connection to db every call
client = get_db_client_connection()

# FASTAPI
#
# Set up coors middleware to allow requests from react
# ---------------------------------------------
app = FastAPI()

origins = [
    "http://localhost:3000/",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------------------------------------

# POST Functions
# ---------------------------------------------
@app.get("/teams")
async def get_all_teams_controller():
    """
    Returns teams table from mongodb
    Common information for each team, name, city, teamid
    """
    return get_teams(client=client)


@app.post("/gamesByTeam")
async def get_all_games_by_team(data: TeamSearch):
    """
    Used by choose by team
    If just one team selected query all their games from db
    If two selected query all games where they play eachother
    """
    if data.teams[1] is None:
        games = get_games_by_team_db(team_id=data.teams[0]['id'], client=client, seasons=data.seasons, game_type=data.game_type)
    else:
        ids = [data.teams[0]['id'], data.teams[1]['id']]
        games = get_games_by_matchup_db(team_ids=ids, client=client, seasons=data.seasons, game_type=data.game_type)
    
    # if no games found
    if games['seasons_list'] == []:
        return "no games"
    else:
        return JSONResponse(content=games)
    
   # return JSONResponse(content=games)

@app.post("/date")
async def get_games_on_date_controller(data: DateStr):
    """
    Used by Choose by date
    Fix date format and query from db for that date
    Returns all games that day in dict

    If none: returns "no games"
    """
    print('Requested ' + data.value)
    db_date = fix_date_db(data.value)
    games_db = get_games_on_date_db(date=db_date, client=client)
    if games_db == ():
        return "no games"
    else:
        return JSONResponse(content=games_db)

@app.post('/playByPlay')
async def get_play_by_play_dictionary(data: PlayByPlayStr):
    """
    Returns play by play dict that contains each play from the game
    Used in gameDetails playlist (front)
    """
    plays = get_playByPlay_db(client=client, gameID=data.gameID, statType=data.statType)
    return JSONResponse(content=plays)

@app.post('/updateViewCount')
async def update_view_count_of_game(data: ViewCount):
    """
    Adds 1 to viewcount for respective game
    """
    update_game_view_count_db(data.gameID, client=client)

@app.post('/getGameByID')
async def get_game_by_id(data: ViewCount):
    """
    Returns game by game_id
    """
    game = get_game_by_id_db(data.gameID, client=client)
    return JSONResponse(content=game)
# --------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
