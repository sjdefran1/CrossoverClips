from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from apscheduler.schedulers.background import BackgroundScheduler
from time import perf_counter

# my scripts
from db.gamesController import get_games_on_date_db, get_games_by_team_db, get_games_by_matchup_db, update_game_view_count_db
from db.get_database import get_db
from db.teamsController import get_teams
from db.createCollections import update_today
from db.playByPlayController import check_playByPlay_exists, insert_playByPlay_db, get_playByPlay_db
from scripts.playByPlayV2.playByPlayV2Handler import playByPlayV2Urls, get_all_stats_V2, getPlayByPlayV2Json
from scripts.api.requestModels import DateStr, PlayByPlayStr, GameInfo, TeamSearch, ViewCount
from scripts.api.api_helpers import fix_date_db, get_season_str


# Global Var
# ---------------
# db client
client = get_db()


# Scheduler
# ------------------------------------------------

def update_db_today() -> None:
    print("Starting to Update Today")
    update_today()
    print("job finished")
    return

def get_other_stats_jobV2(gameID: str, response, fgm, y, d, m):
    print(f"Getting other Stat Types for {gameID}")
    complete_playbyplay_dic = get_all_stats_V2(gameID=gameID, response=response, fgm=fgm,  m=m, d=d, y=y)
    insert_playByPlay_db(client=client, game=complete_playbyplay_dic.copy())
    #print(complete_playbyplay_dic)
    print("finsihed")

# scheduler = BackgroundScheduler()
# scheduler.add_job(update_db_today, 'interval', seconds=60 * 5)

# -------------------------------------

# FASTAPI
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


# Startup and Shutdown
# -------------------------------------------
# @app.on_event("startup")
# async def startup_event():
#     scheduler.start()
#     print("Starting to Update Today")
#     update_today()
#     print("Started Scheduler**")

# @app.on_event("shutdown")
# async def shutdown_event():
#     scheduler.shutdown()
#     print("Scheduler shutdown..")
# ---------------------------------------------

# POST Functions
# ---------------------------------------------

@app.get('/detaTest')
async def deta_test():
    return "hello"


# @app.post("/teams")
# async def get_all_teams_controller():
#     return get_teams(client=client)


@app.get("/teams")
async def get_all_teams_controller():
    return get_teams(client=client)


@app.post("/gamesByTeam")
async def get_all_games_by_team(data: TeamSearch):
    if data.teams[1] is None:
        games = get_games_by_team_db(team_id=data.teams[0]['id'], client=client, seasons=data.seasons)
    else:
        ids = [data.teams[0]['id'], data.teams[1]['id']]
        games = get_games_by_matchup_db(team_ids=ids, client=client, seasons=data.seasons)
    return JSONResponse(content=games)

@app.post("/date")
async def get_games_on_date_controller(data: DateStr):
    print('Requested ' + data.value)
    db_date = fix_date_db(data.value)
    games_db = get_games_on_date_db(date=db_date, client=client)
    if games_db == ():
        return "no games"
    else:
        return JSONResponse(content=games_db)

@app.post('/playByPlay')
async def get_play_by_play(data: PlayByPlayStr):
    start = perf_counter()
    new_date = fix_date_db(data.date)

    # Game exists in our database already retrieve it and return
    if(check_playByPlay_exists(gameID=data.gameID, client=client)):
        plays = get_playByPlay_db(client=client, gameID=data.gameID, statType = data.statType)
        end = perf_counter()
        print(f"Execution time for PlayByPlay (Database): {end-start:.6f}\n")
        return JSONResponse(content=plays)

    split_date = new_date.split('-')
    response = getPlayByPlayV2Json(game_id=data.gameID)
    plays = playByPlayV2Urls(game_id=data.gameID, y=split_date[0], d=split_date[2], m=split_date[1], stat_type=data.statType, response=response)
    #scheduler.add_job(get_other_stats_jobV2, args=[data.gameID, response, plays, split_date[0], split_date[2], split_date[1]])    
    end = perf_counter()
    print(f"Execution time for PlayByPlay: {end-start:.6f}\n")
    return JSONResponse(content=plays)

@app.post('/updateViewCount')
async def update_view_count_of_game(data: ViewCount):
    update_game_view_count_db(data.gameID, client=client)
# --------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
