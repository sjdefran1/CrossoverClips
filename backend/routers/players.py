import os
from time import perf_counter
import uuid
from json import dumps, loads
from datetime import datetime

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from playersUtil.playsQueryExecutor import plays_query_executor
import psycopg2
import pandas as pd
from dotenv import load_dotenv

from routers import pgresdatabase as db

load_dotenv()

from playersUtil.playsQueryBuilder import (
    build_plays_search_query_arrays,
)
from playersUtil.playSql import (
    PLAYS_QUERY_COLUMNS_NAMES,
    SAMPLE_PLAYS_FOR_PLAYER,
)
from playersUtil.table_schemas import *
from playersUtil.RequestModels import PlayOptions, PlayOptionsArrays, Player, Update

players_router = APIRouter(prefix="/players")


def split_array_into_pages(arr: list, df_cols: list, page_length=5) -> dict:
    """"""
    page_dict = {}
    num_pages = (
        len(arr) + page_length - 1
    ) // page_length  # Calculate the number of pages

    for page_num in range(1, num_pages + 1):
        start_idx = (page_num - 1) * page_length
        end_idx = start_idx + page_length
        page_dict[page_num] = arr[start_idx:end_idx]

    for page in page_dict:
        df = pd.DataFrame(data=page_dict[page], columns=df_cols)
        page_dict[page] = loads(df.to_json(orient="records"))

    return page_dict


@players_router.get("/teams")
async def get_all_teams_controller() -> JSONResponse:
    """Returns all teams"""
    db.ping_db()
    db.psy_cursor.execute("SELECT * FROM teams")
    ret_list = []
    for res in db.psy_cursor.fetchall():
        ret_list.append(res)

    return JSONResponse(content=ret_list)


@players_router.post("/updatePlayViewCount")
async def update_play_view_count(update: Update):
    """Temp view tracker until playbyplay setup"""
    db.ping_db()
    db.psy_cursor.execute(f"select views from plays where url='{update.url}'")
    res = db.psy_cursor.fetchone()
    # add 1 to views and update it
    update_query = f"UPDATE plays SET views = {res[0]+1} WHERE url = '{update.url}'"

    db.psy_cursor.execute(update_query)
    db.psyconn.commit()

    return JSONResponse(content={"new_val": res[0] + 1})


@players_router.post("/updatePlayDownloadCount")
async def update_play_download_count(update: Update):
    """Temp download tracker until playbyplay setup"""
    db.ping_db()
    db.psy_cursor.execute(
        f"select downloads from plays where url='{update.url}' and ptype='{update.ptype}'"
    )
    res = db.psy_cursor.fetchone()
    # add 1 to views and update it
    update_query = f"UPDATE plays SET downloads = {res[0]+1} WHERE url = '{update.url}' and ptype='{update.ptype}'"

    db.psy_cursor.execute(update_query)
    db.psyconn.commit()
    return JSONResponse(content={"new_val": res[0] + 1})


@players_router.post("/registerOrUpdateViewer")
async def register_or_update_viewer(req: Request) -> JSONResponse:
    """
    if user exists already in table based of ip, update view count

    if doesnt exists insert into table, includes a first_visit_date and last_visited_date
    """
    db.ping_db()
    query = f"SELECT COUNT(*) FROM viewers WHERE ip = '{req.client.host}';"
    db.psy_cursor.execute(query)
    # Check if the count of rows returned is greater than 0
    ip_exists = db.psy_cursor.fetchone()[0] > 0

    if ip_exists:
        print(f"USER INFORMATION - Returning user! |{req.client.host}|")
        # user has visited before
        # get current time as str and then convert back into timestamp
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        current_time = datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S.%f")
        # increment visit count + 1
        # update last visited time
        query = f"""
        UPDATE viewers
        SET 
            visit_count = visit_count + 1,
            last_visited_time = '{current_time}'
        WHERE ip = '{req.client.host}';
        """
        db.psy_cursor.execute(query)
    else:
        # new user
        # insert ip and set visit count to 1
        print(f"USER INFORMATION - New user! |{req.client.host}|")

        query = f"""
        INSERT INTO viewers (ip, visit_count) VALUES ('{req.client.host}', 1);    
        """
        db.psy_cursor.execute(query)

    db.psyconn.commit()
    return JSONResponse(content="success")


@players_router.get("/allPlayers")
def get_all_players():
    """return all players from db"""
    db.ping_db()
    db.psy_cursor.execute("select * from players order by views desc;")
    df = pd.DataFrame(
        data=db.psy_cursor.fetchall(),
        columns=[
            "playerID",
            "fname",
            "lname",
            "yrsplayed",
            "jerseynum",
            "pos",
            "status",
            "teamID",
            "goatflag",
            "views",
        ],
    )
    return JSONResponse(content=loads(df.to_json(orient="records")))


@players_router.post("/plays2")
async def get_players_plays_arr(
    opts: PlayOptionsArrays, request: Request
) -> JSONResponse:
    """
    Main Functionality of player dashboard

    Uses build_plays_search_query to create a sql query for the requested

    Executes and creates return dict

    """
    db.ping_db()
    start = perf_counter()

    # edge case
    # w/ the way our sql queries are set up FGM needs to be included
    # to find how many pts the player had in game
    non_fgm_query = False
    if opts.stat_type and "FGM" not in opts.stat_type:
        opts.stat_type.append("FGM")
        non_fgm_query = True

    try:
        # if fgm not in options
        # add fgm to options, then sql query that w where clasue that says not fgm
        print(f"FILTERED SEARCH - FOR |{opts.player_id}|")
        query = build_plays_search_query_arrays(opts=opts)
        result_dict = plays_query_executor(query=query, non_fgm=non_fgm_query)
        pages_split = split_array_into_pages(
            arr=result_dict["results"], df_cols=PLAYS_QUERY_COLUMNS_NAMES
        )
        return_dict = {
            "len": result_dict["len"],
            "page_count": len(pages_split.keys()),
            "games_available": result_dict["games_available"],
            "results": pages_split,
        }
        end = perf_counter()
        print(f"Execution time for Query: {end - start:.6f} seconds\n")
        return JSONResponse(content=return_dict, status_code=200)
    except Exception as e:
        print(
            f"EXCEPTION OCCURED IN get_players_plays_arr\nEXCEPTION:{e}\nOPTIONS:{opts}"
        )
        return JSONResponse(status_code=404)


@players_router.post("/samplePlays2")
async def get_sample_plays_for_player(player: Player):
    """
    Returns 20 highlights for player, sorted by most viewed
    Also updates players view count + 1
    """
    db.ping_db()
    # update player views
    query = f"""
    UPDATE 
        players
    SET 
        views = views + 1
    WHERE pid={player.pid};
    """
    print(f"SAMPLE PLAYS - Updating views for |{player.pid}|")
    db.psy_cursor.execute(query)

    # get sample plays
    result_dict = plays_query_executor(
        SAMPLE_PLAYS_FOR_PLAYER.format(player.pid),
        samplePlays=1,
    )

    pages_split = split_array_into_pages(
        arr=result_dict["results"], df_cols=PLAYS_QUERY_COLUMNS_NAMES
    )

    return_dict = {
        "len": result_dict["len"],
        "page_count": len(pages_split.keys()),
        "results": pages_split,
    }

    db.psyconn.commit()
    return JSONResponse(content=return_dict, status_code=200)


if __name__ == "__main__":
    import uvicorn

    load_dotenv()
    PG_URL = os.getenv("POSTGRESNEON")
    uvicorn.run(players_router, host="localhost", port=8000)
