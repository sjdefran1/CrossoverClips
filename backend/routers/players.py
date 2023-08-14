import os
import uuid
from json import loads
from datetime import datetime

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
import psycopg2
import pandas as pd
from dotenv import load_dotenv

from routers import pgresdatabase as db

load_dotenv()

from playersUtil.playsQueryBuilder import (
    build_plays_search_query,
    build_plays_search_query_arrays,
)
from playersUtil.playSql import (
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


def split_array_into_pages(arr: list, df_cols: list, page_length=5):
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


def sort_plays(plays):
    def custom_sort_key(play):
        gid = play[2]  # GID
        quarter = play[10]
        ptime = play[9]
        # Convert quarter and ptime to a sortable value
        quarter_value = int(quarter) * 1000 - int(ptime.replace(":", ""))
        return (gid, quarter_value)

    sorted_plays = sorted(plays, key=custom_sort_key)
    return sorted_plays


def plays_query_executor(query: str) -> dict:
    """
    Creates view using provided query

    View adds a row_number column that allows for pagination and offsets

    Selects all results as well as len and stores them in a dict

    Drops view,

    ### returns
    dict `{'results': rowset: list, 'len': len of rowset: int}`
    """
    db.ping_db()
    results_dict = {}
    view_name = generate_unique_view_name()
    add_str = CREATE_VIEW.format(view_name)
    query = "".join([add_str, query])

    # Create view
    print(f"CREATING VIEW\n{query}")
    db.psy_cursor.execute(query)

    # Get length
    # [0][0] gets int value of len instead of row arr
    try:
        db.psy_cursor.execute(f"select count(*) from {view_name}")
        results_dict["len"] = db.psy_cursor.fetchall()[0][0]

        # Select all plays store as results
        db.psy_cursor.execute(
            f"select * from {view_name} order by row_number asc limit 1000;"
        )
        sorted_plays = sort_plays(db.psy_cursor.fetchall())
        # results_dict["results"] = db.psy_cursor.fetchall()
        results_dict["results"] = sorted_plays
    except Exception as e:
        # no results will throw error when try to fetchall
        # manually set dict drop view and return
        print(e)
        results_dict["len"] = 0
        results_dict["results"] = []
        print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
        db.psy_cursor.execute(DROP_VIEW.format(view_name))
        return results_dict

    # drop view
    print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
    db.psy_cursor.execute(DROP_VIEW.format(view_name))
    return results_dict


@players_router.get("/teams")
async def get_all_teams_controller() -> JSONResponse:
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
        print(f"Returning user! {req.client.host}")
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
        print(f"New user! {req.client.host}")

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
    db.ping_db()
    query = build_plays_search_query_arrays(opts=opts)
    result_dict = plays_query_executor(query=query)
    pages_split = split_array_into_pages(
        arr=result_dict["results"], df_cols=PLAYS_QUERY_COLUMNS_NAMES
    )
    return_dict = {
        "len": result_dict["len"],
        "page_count": len(pages_split.keys()),
        "results": pages_split,
    }
    return JSONResponse(content=return_dict, status_code=200)


@players_router.post("/samplePlays2")
async def get_sample_plays_for_player_test(player: Player):
    db.ping_db()
    # update player views
    query = f"""
    UPDATE 
        players
    SET 
        views = views + 1
    WHERE pid={player.pid};
    """
    print(query)
    db.psy_cursor.execute(query)

    # get sample plays
    result_dict = plays_query_executor(SAMPLE_PLAYS_FOR_PLAYER.format(player.pid))
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


@players_router.post("/updatePlayerView")
def update_player_view(player: Player):
    db.ping_db()
    return


if __name__ == "__main__":
    import uvicorn

    load_dotenv()
    PG_URL = os.getenv("POSTGRESNEON")
    uvicorn.run(players_router, host="localhost", port=8000)
