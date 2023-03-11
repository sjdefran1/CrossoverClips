from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from get_schedule import get_games_on_date
from playbyplayToUrls import getPlayByPlayWithUrl
from game_info import get_game_info
from nba_games_endpoint import update_scores
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
import json
from time import perf_counter
from db.gamesController import get_games_on_date_db
from db.get_database import get_db
from retroPlayByPlay import getRetroPlayByPlay
from db.createCollections import update_today
from db.playByPlayController import check_playByPlay_exists, insert_playByPlay_db, get_playByPlay_db
# Global Var
# ---------------

# db client
client = get_db()


# Helpers
# ---------------------------
def fix_date(date: str) -> str:
    date_format = "%a, %d %b %Y %H:%M:%S %Z"
    parsed_date = datetime.strptime(date, date_format)
    new_date = parsed_date.strftime("%m/%d/%Y")
    return new_date

def fix_date_db(date: str) -> str:
    date_format = "%a, %d %b %Y %H:%M:%S %Z"
    parsed_date = datetime.strptime(date, date_format)
    new_date = parsed_date.strftime("%Y-%m-%d")
    return new_date

def isRetroDate(date_recieved: str) -> bool:
    set_date = datetime(2019, 12, 1).date()
    # Convert the string to a datetime object
    check_date = datetime.strptime(date_recieved, '%Y-%m-%d').date()
    if check_date < set_date:
        return True
    else:
        return False

def get_season_str(date_recieved: str) -> str:
    date_recieved = datetime.strptime(date_recieved, '%Y-%m-%d').date()
    # Define the year date ranges
    season_ranges = {
        '2014-15': (datetime(2014, 10, 28).date(), datetime(2015, 4, 15).date()),
        '2015-16': (datetime(2015, 10, 27).date(), datetime(2016, 4, 13).date()),
        '2016-17': (datetime(2016, 10, 25).date(), datetime(2017, 4, 12).date()),
        '2017-18': (datetime(2017, 10, 17).date(), datetime(2018, 4, 10).date()),
        '2018-19': (datetime(2018, 10, 16).date(), datetime(2019, 4, 10).date()),
        '2019-20': (datetime(2019, 10, 22).date(), datetime(2019, 12, 1).date()),
    }

    # Iterate over the years and return the matching season
    for year, (start_date, end_date) in season_ranges.items():
        #print(f"{start_date} <= {date_recieved} <= {end_date}")
        if start_date <= date_recieved <= end_date:
            return year

    # Return None if no matching year was found
    return ""
# ---------------------------------------

# Scheduler
# ------------------------------------------------
# def update_scores_job():
#     print(f"Updating Scores @ {str(datetime.now())}")
#     update_scores()
#     print("Scores Updated")

def update_db_today() -> None:
    update_today()
    print("job finished")
    return

scheduler = BackgroundScheduler()
scheduler.add_job(update_db_today, 'interval', seconds=60 * 5)
# -----------------------------------------------------

# Data Models for json Requests
# ---------------------------------
class DateStr(BaseModel):
    value: str
class PlayByPlayStr(BaseModel):
    gameID: str
    date: str
    statType: str

class GameInfo(BaseModel):
    date: str
    gameID: str

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
    allow_headers=["*"]
)
# ------------------------------------------------------


# Startup and Shutdown
# -------------------------------------------
@app.on_event("startup")
async def startup_event():
    scheduler.start()
    update_today()
    print("Started Scheduler**")

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
    print("Scheduler shutdown..")
# ---------------------------------------------

# POST Functions
# ---------------------------------------------
@app.post("/date")
async def get_games_on_date_controller(data: DateStr):
    print('Requested ' + data.value)
    date = fix_date(data.value)
    #games = get_games_on_date(date)
    #print(json.dumps(games, indent=1))
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
    
    # If we already have this games playbyplay return that instead
    # of requesting nba

    if(check_playByPlay_exists(gameID=data.gameID, client=client)):
        plays = get_playByPlay_db(client=client, gameID=data.gameID)
        end = perf_counter()
        print(f"Execution time for PlayByPlay (Database): {end-start:.6f}\n")
        return JSONResponse(content=plays)

    # Requesting NBA
    # If its a retro date use retroPlayByPlay instead
    if isRetroDate(new_date):
        season_str = get_season_str(new_date)
        plays = getRetroPlayByPlay(gameID=data.gameID, season=season_str, stat_type=data.statType)
    else:
        split_date = new_date.split('-')
        plays = getPlayByPlayWithUrl(gameID=data.gameID, year=split_date[0], day=split_date[2], month=split_date[1], stat_type=data.statType)

    # Since we dont have the playbyplpay for this game in the db
    # insert it for future
    insert_playByPlay_db(client=client, game=plays.copy())
    end = perf_counter()
    print(f"Execution time for PlayByPlay: {end-start:.6f}\n")
    return JSONResponse(content=plays)

# deprecated ??
@app.post('/gameInfo')
async def get_game_info_handler(data: GameInfo):
    
    new_date = fix_date(data.date)
    split_date = new_date.split('/')
    game_info = get_game_info(gameID=data.gameID, year=split_date[2], day=split_date[1], month=split_date[0])
    return JSONResponse(content=game_info)

# --------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
