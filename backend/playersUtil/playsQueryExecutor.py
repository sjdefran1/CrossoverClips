from time import perf_counter
import uuid
from json import loads

import pandas as pd
from dotenv import load_dotenv
from playersUtil.RequestModels import PlayOptionsArrays
from playersUtil.playsQueryBuilder import get_correct_tuple_str
from routers import pgresdatabase as db

load_dotenv()

from playersUtil.playSql import (
    AVAILABLE_GAMES_PTS_AST_BLKS_SQL,
    ORDER_BY_PLAY_ID_SQL,
    CREATE_VIEW,
    DROP_VIEW,
)
from playersUtil.table_schemas import *


def generate_unique_view_name() -> str:
    """Creates unique temp view name for query"""
    # temp_table_539c35fb19024e7880738152f7743f89
    # removes - per postgres standars
    return ("temp_table_" + str(uuid.uuid4()).replace("-", "")).lower()


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


def plays_query_executor(
    query: str, opts: PlayOptionsArrays = None, non_fgm=False, samplePlays=0
) -> dict:
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
            stat_query = AVAILABLE_GAMES_PTS_AST_BLKS_SQL.format(view_name)
            # build and execute stat query that returns PTS, BLKS, AST for available_games
            stat_query = "".join([stat_query, ORDER_BY_PLAY_ID_SQL])
            print(stat_query)
            db.psy_cursor.execute(stat_query)
            results_dict["games_available"] = get_games_with_pts(
                db.psy_cursor.fetchall()
            )

            # grab first 500 plays to be returned to usr
            # if non_fgm we need to remove those rows after
            # finding how many pts the player scored that game
            if opts.stat_type is not None:
                # print(opts)
                if non_fgm:
                    opts.stat_type.remove("FGM")
                    correct_stat_types_str = get_correct_tuple_str(opts.stat_type)
                else:
                    correct_stat_types_str = get_correct_tuple_str(opts.stat_type)
                results_query = (
                    f"select * from {view_name} where ptype in {correct_stat_types_str}"
                )
            else:
                results_query = (
                    f"select * from {view_name} where ptype != 'FGM'"
                    if non_fgm
                    else f"select * from {view_name}"
                )
            print(results_query)
            # if non_fgm:
            #     results_query = results_query + " where ptype != 'FGM'"
            results_query = results_query + " order by row_number asc limit 500;"
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
