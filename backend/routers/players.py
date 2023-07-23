import os
import uuid
from json import loads

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

from playersUtil.playsQueryBuilder import build_plays_query
from playersUtil.playSql import PLAYS_QUERY_COLUMNS_NAMES, CREATE_VIEW, DROP_VIEW
from playersUtil.table_schemas import *
from playersUtil.RequestModels import PlayOptions

players_router = APIRouter(prefix="/players")


def generate_unique_view_name():
    """Creates unique temp view name for query"""
    # temp_table_539c35fb19024e7880738152f7743f89
    # removes - per postgres standars
    return ("temp_table_" + str(uuid.uuid4()).replace("-", "")).lower()


def plays_query_executor(query: str) -> dict:
    """
    Creates view using provided query

    View adds a row_number column that allows for pagination and offsets

    Selects all results as well as len and stores them in a dict

    Drops view,

    ### returns
    dict `{'results': rowset: list, 'len': len of rowset: int}`
    """
    ping_db()
    results_dict = {}
    view_name = generate_unique_view_name()
    add_str = CREATE_VIEW.format(view_name)
    query = "".join([add_str, query])

    # Create view
    print(f"CREATING VIEW\n{query}")
    psy_cursor.execute(query)

    # Get length
    # [0][0] gets int value of len instead of row arr
    psy_cursor.execute(f"select count(*) from {view_name}")
    results_dict["len"] = psy_cursor.fetchall()[0][0]

    # Select all plays store as results
    psy_cursor.execute(
        f"select * from {view_name} order by row_number desc limit 1000;"
    )
    results_dict["results"] = psy_cursor.fetchall()

    # drop view
    print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
    psy_cursor.execute(DROP_VIEW.format(view_name))
    return results_dict


def create_connections():
    """Makes connection w/ postgres db, declares psy_cursor and psyconn globally"""
    global psy_cursor
    global psyconn
    print("\tCONNECTING TO DATABASE")
    psyconn = psycopg2.connect(
        host=os.getenv("NEONHOST"),
        port=os.getenv("NEONPORT"),
        user=os.getenv("USER"),
        database=os.getenv("DATABASE"),
        password=os.getenv("PASSWORD"),
    )
    psy_cursor = psyconn.cursor()
    print("\tFINISHED")


def ping_db():
    """Checks if connection to db has closed, resets connection if it has"""
    try:
        psy_cursor.execute("SELECT 1")
    except psycopg2.OperationalError:
        print("Connection was closed")
        create_connections()  # reset connection


@players_router.on_event("startup")
async def startup():
    create_connections()


@players_router.get("/teams")
async def get_all_teams_controller():
    psy_cursor.execute("SELECT * FROM teams")
    ret_list = []
    for res in psy_cursor.fetchall():
        ret_list.append(res)

    return JSONResponse(content=ret_list)


@players_router.get("/plays")
async def get_players_plays(opts: PlayOptions, request: Request):
    
    query = build_plays_query(opts=opts)
    result_dict = plays_query_executor(query=query)
    df = pd.DataFrame(data=result_dict["results"], columns=PLAYS_QUERY_COLUMNS_NAMES)
    return_dict = {
        "len": result_dict["len"],
        "results": loads(df.to_json(orient="records")),
    }
    return JSONResponse(content=return_dict, status_code=200)


@players_router.on_event("shutdown")
async def shutdown():
    print("\tCLOSING CURSOR")
    psy_cursor.close()
    psyconn.close()
    print("\tCLOSED")


if __name__ == "__main__":
    import uvicorn

    load_dotenv()
    PG_URL = os.getenv("POSTGRESNEON")
    uvicorn.run(players_router, host="localhost", port=8000)