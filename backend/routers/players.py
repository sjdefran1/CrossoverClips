import os
from time import perf_counter
import uuid
from json import dumps, loads
from datetime import datetime

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
import psycopg2
import pandas as pd
from dotenv import load_dotenv

from routers import pgresdatabase as db

load_dotenv()

from playersUtil.playsQueryBuilder import (
    build_plays_search_query_arrays,
)
from playersUtil.playSql import (
    AVAILABLE_GAMES_PTS_AST_BLKS_SQL,
    AVAILABLE_GAMES_PTS_AST_BLKS_SQL_2,
    AVAILABLE_GAMES_PTS_AST_BLKS_SQL_3,
    NON_FGM_WHERE_CLAUSE_SQL,
    ORDER_BY_PLAY_ID_SQL,
    PLAYS_QUERY_COLUMNS_NAMES,
    CREATE_VIEW,
    DROP_VIEW,
    SAMPLE_PLAYS_FOR_PLAYER,
)
from playersUtil.table_schemas import *
from playersUtil.RequestModels import PlayOptions, PlayOptionsArrays, Player, Update

players_router = APIRouter(prefix="/players")


def generate_unique_view_name() -> str:
    """Creates unique temp view name for query"""
    # temp_table_539c35fb19024e7880738152f7743f89
    # removes - per postgres standars
    return ("temp_table_" + str(uuid.uuid4()).replace("-", "")).lower()


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


def sort_plays(plays: list) -> list:
    """
    Ensures that plays are in order for user

    Instead of returning all FGM then BLK etc it orders them by time and quarter
    """

    def custom_sort_key(play):
        gid = play[2]  # GID
        quarter = play[10]
        ptime = play[9]
        # Convert quarter and ptime to a sortable value
        quarter_value = int(quarter) * 1000 - int(ptime.replace(":", ""))
        return (gid, quarter_value)

    sorted_plays = sorted(plays, key=custom_sort_key)
    return sorted_plays


def get_games_with_pts(rows: list):
    """
    Parses last description str for play in game and returns point value
    """

    def get_pts_from_description(desc: str):
        return int(desc.split("(")[1].split(")")[0].split(" ")[0])

    df = pd.DataFrame(
        data=rows,
        columns=[
            "gid",
            "playid",
            "playerpts",
            "matchupstr",
            "atid",
            "htid",
            "sznstr",
            "hwl",
            "hpts",
            "apts",
            "views",
            "date",
            "pwl",
            "ast_count",
            "blk_count",
        ],
    )
    df.set_index("gid", inplace=True)

    df["playerpts"] = df["playerpts"].apply(get_pts_from_description)
    return loads(df.to_json(orient="index"))


def plays_query_executor(query: str, non_fgm=False, samplePlays=0) -> dict:
    """
    - Creates view using provided query
    - View adds a row_number column that allows for pagination and offsets
    - Selects all results as well as len and stores them in a dict
    - Gathers Player PTS, AST, BLK counts for game
    - Sorts Plays by time that happened rather by statype like they are stored
    - Drops view

    Returns empty lists for dict keys on exceptions
    """
    results_dict = {}
    view_name = generate_unique_view_name()
    add_str = CREATE_VIEW.format(view_name)
    query = "".join([add_str, query])

    # Create view w/ base filter query
    print("\tPQE - EXECUTING VIEW CREATION")
    db.psy_cursor.execute(query)

    try:
        # Len of possible plays
        db.psy_cursor.execute(f"select count(*) from {view_name}")
        results_dict["len"] = db.psy_cursor.fetchall()[0][0]

        # get information for available games if its a filtered search
        # also need to sort plays by quarter/time when filtered search
        # else don't worry abt it reduce response time for sample play queries
        if samplePlays == 0:
            print("\tPQE - EXECUTING STAT QUERY")
            stat_query = AVAILABLE_GAMES_PTS_AST_BLKS_SQL_3.format(view_name)
            # build and execute stat query that returns PTS, BLKS, AST for available_games

            stat_query = "".join([stat_query, ORDER_BY_PLAY_ID_SQL])
            db.psy_cursor.execute(stat_query)
            results_dict["games_available"] = get_games_with_pts(
                db.psy_cursor.fetchall()
            )

            # grab first 1000 plays to be returned to usr
            #   - if we aren't looking for fgm we need to
            #     remove those rows after finding how many pts the player scored that game

            results_query = f"select * from {view_name}"
            if non_fgm:
                results_query = results_query + " where ptype != 'FGM'"
            results_query = results_query + " order by row_number asc limit 1000;"
            db.psy_cursor.execute(results_query)

            # order by Game -> Quarter -> by ptime desc from 12:00
            results_dict["results"] = sort_plays(db.psy_cursor.fetchall())
        else:
            # We also don't want to order by row number here b/c we ordered by views
            # in the sample plays of top 20 viewed
            print("\tPQE - EXECUTING SAMPLE PLAYS QUERY")
            db.psy_cursor.execute(f"select * from {view_name} limit 20;")
            results_dict["results"] = db.psy_cursor.fetchall()
            results_dict["games_available"] = []
    except Exception as e:
        # no results will throw error when try to fetchall
        # manually set dict drop view and return
        print(
            f"EXCEPTION OCCURED IN PLAY QUERY EXECUTOR\n{'-'*50}{e}\n{query}\n{'-'*50}"
        )
        results_dict["len"] = 0
        results_dict["results"] = []
        results_dict["games_available"] = []
        print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
        db.psy_cursor.execute(DROP_VIEW.format(view_name))
        return results_dict

    # drop view
    db.psy_cursor.execute(DROP_VIEW.format(view_name))
    return results_dict


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
        print("STAT TYPE NOT NONE AND FGM NOT INCLUDED")
        opts.stat_type.append("FGM")
        print(opts.stat_type)
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
        SAMPLE_PLAYS_FOR_PLAYER.format(player.pid), samplePlays=1
    )
    # print(result_dict)
    pages_split = split_array_into_pages(
        arr=result_dict["results"], df_cols=PLAYS_QUERY_COLUMNS_NAMES
    )
    # print(pages_split)
    # print(pages_split)

    # df = pd.DataFrame(data=result_dict["results"], columns=PLAYS_QUERY_COLUMNS_NAMES)
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
