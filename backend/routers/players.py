import os
import uuid
from json import loads
from datetime import datetime

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
import psycopg2
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

from playersUtil.playsQueryBuilder import build_plays_search_query, build_plays_search_query_arrays
from playersUtil.playSql import PLAYS_QUERY_COLUMNS_NAMES, CREATE_VIEW, DROP_VIEW, SAMPLE_PLAYS_FOR_PLAYER
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
    num_pages = (len(arr) + page_length - 1) // page_length  # Calculate the number of pages

    for page_num in range(1, num_pages + 1):
        start_idx = (page_num - 1) * page_length
        end_idx = start_idx + page_length
        page_dict[page_num] = arr[start_idx:end_idx]

    for page in page_dict:
        df = pd.DataFrame(data=page_dict[page], columns=df_cols)
        page_dict[page] = loads(df.to_json(orient='records'))

    return page_dict


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
    try:
        psy_cursor.execute(f"select count(*) from {view_name}")
        results_dict["len"] = psy_cursor.fetchall()[0][0]

        # Select all plays store as results
        psy_cursor.execute(
            f"select * from {view_name} order by row_number asc limit 1000;"
        )
        results_dict["results"] = psy_cursor.fetchall()
    except Exception:
        # no results will throw error when try to fetchall
        # manually set dict drop view and return
        results_dict['len'] = 0
        results_dict['results'] = []
        print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
        psy_cursor.execute(DROP_VIEW.format(view_name))
        return results_dict

    # drop view
    print(f"Dropping VIEW\n{DROP_VIEW.format(view_name)}")
    psy_cursor.execute(DROP_VIEW.format(view_name))
    return results_dict


def create_connections() -> None:
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
    return

def ping_db() -> None:
    """Checks if connection to db has closed, resets connection if it has"""
    try:
        psy_cursor.execute("SELECT 1")
    except psycopg2.OperationalError:
        print("Connection was closed")
        create_connections()  # reset connection
    except psycopg2.InterfaceError:
        print("Cursor was closed")
        create_connections()
    return

@players_router.on_event("startup")
async def startup() -> None:
    create_connections()
    return


@players_router.get("/teams")
async def get_all_teams_controller() -> JSONResponse:
    psy_cursor.execute("SELECT * FROM teams")
    ret_list = []
    for res in psy_cursor.fetchall():
        ret_list.append(res)

    return JSONResponse(content=ret_list)


# @players_router.get("/plays")
# async def get_players_plays(opts: PlayOptions, request: Request) -> JSONResponse:
    
#     query = build_plays_search_query(opts=opts)
#     result_dict = plays_query_executor(query=query)
#     df = pd.DataFrame(data=result_dict["results"], columns=PLAYS_QUERY_COLUMNS_NAMES)
#     return_dict = {
#         "len": result_dict["len"],
#         "results": loads(df.to_json(orient="records")),
#     }
#     return JSONResponse(content=return_dict, status_code=200)



@players_router.post("/updatePlayViewCount")
async def update_play_view_count(update: Update):
    """Temp view tracker until playbyplay setup"""
    ping_db()
    psy_cursor.execute(f"select views from plays where url='{update.url}'")
    res = psy_cursor.fetchone()
    # add 1 to views and update it
    update_query = \
        f"UPDATE plays SET views = {res[0]+1} WHERE url = '{update.url}'"

    psy_cursor.execute(update_query)
    psyconn.commit()

    return JSONResponse(content={'new_val': res[0]+1})    

@players_router.post("/updatePlayDownloadCount")
async def update_play_download_count(update: Update):
    """Temp download tracker until playbyplay setup"""
    ping_db()
    psy_cursor.execute(f"select downloads from plays where url='{update.url}' and ptype='{update.ptype}'")
    res = psy_cursor.fetchone()
    # add 1 to views and update it
    update_query = \
        f"UPDATE plays SET downloads = {res[0]+1} WHERE url = '{update.url}' and ptype='{update.ptype}'"

    psy_cursor.execute(update_query)
    psyconn.commit()
    return JSONResponse(content={'new_val': res[0]+1})    

@players_router.post("/registerOrUpdateViewer")
async def register_or_update_viewer(req: Request) -> JSONResponse:
    """
    if user exists already in table based of ip, update view count

    if doesnt exists insert into table, includes a first_visit_date and last_visited_date
    """
    ping_db()
    query = f"SELECT COUNT(*) FROM viewers WHERE ip = '{req.client.host}';"
    psy_cursor.execute(query)
    # Check if the count of rows returned is greater than 0
    ip_exists = psy_cursor.fetchone()[0] > 0
    
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
        psy_cursor.execute(query)    
    else:
        # new user
        # insert ip and set visit count to 1
        print(f"New user! {req.client.host}")

        query = f"""
        INSERT INTO viewers (ip, visit_count) VALUES ('{req.client.host}', 1);    
        """
        psy_cursor.execute(query)
    
    psyconn.commit()
    return JSONResponse(content='success')

@players_router.get("/allPlayers")
def get_all_players():
    """return all players from db"""
    ping_db()
    psy_cursor.execute("select * from players order by views desc;")
    df = pd.DataFrame(
        data=psy_cursor.fetchall(), 
        columns=['playerID', 'fname', 'lname',\
                'yrsplayed', 'jerseynum', 'pos',\
                'status','teamID', 'goatflag', 'views'] 
    )
    return JSONResponse(content=loads(df.to_json(orient='records')))

# @players_router.post("/samplePlays")
# def get_sample_plays_for_player(player: Player):
#     ping_db()
#     # update player views
#     query =f"""
#     UPDATE 
#         players
#     SET 
#         views = views + 1
#     WHERE pid={player.pid};
#     """
#     print(query)
#     psy_cursor.execute(query)
#     psyconn.commit()

#     # get sample plays
#     result_dict = plays_query_executor(SAMPLE_PLAYS_FOR_PLAYER.format(player.pid))
#     df = pd.DataFrame(data=result_dict["results"], columns=PLAYS_QUERY_COLUMNS_NAMES)
#     return_dict = {
#         "len": result_dict["len"],
#         "results": loads(df.to_json(orient="records")),
#     }
#     return JSONResponse(content=return_dict, status_code=200)


@players_router.post("/plays2")
async def get_players_plays_arr(opts: PlayOptionsArrays, request: Request) -> JSONResponse:
    ping_db()
    query = build_plays_search_query_arrays(opts=opts)
    result_dict = plays_query_executor(query=query)
    pages_split = split_array_into_pages(arr=result_dict['results'], df_cols=PLAYS_QUERY_COLUMNS_NAMES)
    return_dict = {
        "len": result_dict["len"],
        "page_count": len(pages_split.keys()),
        "results": pages_split,
    }
    return JSONResponse(content=return_dict, status_code=200)


@players_router.post("/samplePlays2")
async def get_sample_plays_for_player_test(player: Player):
    ping_db()
    # update player views
    query =f"""
    UPDATE 
        players
    SET 
        views = views + 1
    WHERE pid={player.pid};
    """
    print(query)
    psy_cursor.execute(query)

    # get sample plays
    result_dict = plays_query_executor(SAMPLE_PLAYS_FOR_PLAYER.format(player.pid))
    # print(result_dict)
    pages_split = split_array_into_pages(arr=result_dict['results'], df_cols=PLAYS_QUERY_COLUMNS_NAMES)
    # print(pages_split)
    # print(pages_split)

    # df = pd.DataFrame(data=result_dict["results"], columns=PLAYS_QUERY_COLUMNS_NAMES)
    return_dict = {
        "len": result_dict["len"],
        "page_count": len(pages_split.keys()),
        "results": pages_split,
    }

    psyconn.commit()

    return JSONResponse(content=return_dict, status_code=200)





@players_router.post("/updatePlayerView")
def update_player_view(player: Player):
    ping_db()
   
    return
    
@players_router.on_event("shutdown")
async def shutdown() -> None:
    """runs when server shutsdown, closes out connection and cursor to db"""
    print("\tCLOSING CURSOR & CONNECTION")
    psy_cursor.close()
    psyconn.close()
    print("\tCLOSED")
    return



if __name__ == "__main__":
    import uvicorn

    load_dotenv()
    PG_URL = os.getenv("POSTGRESNEON")
    uvicorn.run(players_router, host="localhost", port=8000)