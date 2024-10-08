from json import loads
import os

from fastapi import Depends, Request, APIRouter
from fastapi.responses import JSONResponse
from playersUtil.table_schemas import PANDAS_SCHEMA

import psycopg2
import pandas as pd

from dotenv import load_dotenv
from requestModels import PlayByPlayStr, GameId, MonthYear, DateStr
from routers import pgresdatabase as db

load_dotenv()

playbyplay_router = APIRouter(prefix="/pgres")


def sort_plays(plays: list) -> list:
    """
    Ensures that plays are in order for user

    Instead of returning all FGM then BLK etc it orders them by time and quarter
    """

    def custom_sort_key(play):
        # Convert quarter and ptime to a sortable value
        quarter_value = int(play["quarter"]) * 1000 - int(play["time"].replace(":", ""))
        return (play["playid"], quarter_value)

    sorted_plays = sorted(plays, key=custom_sort_key)
    return sorted_plays


@playbyplay_router.post("/playByPlay")
async def get_play_by_play_by_gameid(req: GameId):
    db.ping_db()
    db.psy_cursor.execute(
        f"""
        select 
            p1.playid,
            p1.pid,
            p1.gid,
            p1.description,
            p1.ptype,
            p1.url,
            p1.tid,
            p1.hscore,
            p1.ascore,
            p1.ptime,
            p1.quarter,
            p1.views,
            p1.downloads,
            concat(SUBSTRING(p2.fname, 1, 1), '. ', p2.lname) as pname         
        from 
            plays p1 
        join players p2 
            on p1.pid=p2.pid 
        where 
            gid='{req.gid}'
       
        """
        #  and
        #     ptype='{req.statType}';
    )

    df = pd.DataFrame(
        data=db.psy_cursor.fetchall(),
        columns=[
            "playid",
            "playerID",
            "gameID",
            "description",
            "ptype",
            "url",
            "teamID",
            "scoreHome",
            "scoreAway",
            "time",
            "quarter",
            "views",
            "downloads",
            "pname",
        ],
    )

    try:
        # plays = loads(df.to_json(orient="records"))
        players = loads(
            df[["teamID", "pname", "playerID"]]
            .drop_duplicates()
            .to_json(orient="values")
        )

        plays_by_type = {
            ptype: group.to_dict(orient="records")
            for ptype, group in df.groupby("ptype")
        }
        # print(plays_by_type)
        team_ids = df["teamID"].drop_duplicates().tolist()  # [1610612743, 1610612742]
        num_quarters = max(df["quarter"].tolist())
        gid = df["gameID"][0]

        # get rid of weird sorting from NBA
        # sort by quarter -> then play time desc
        sorted_dict = {}
        for play_type in plays_by_type:
            sorted_dict[play_type] = sort_plays(plays=plays_by_type[play_type])

        return_dict = {
            "game_id": gid,
            "number_quarters": num_quarters,
            "team_ids": team_ids,
            "plays": sorted_dict,
            "players": players,
        }
        return JSONResponse(content=return_dict)
    except Exception as e:
        print(e)
        return None


@playbyplay_router.post("/games/calendar")
async def get_days_to_highlight_for_calendar(data: DateStr):
    db.ping_db()

    year = data.value[0:4]
    month = data.value[5:7]

    # SQL query to count games per day for a given month and year
    query = f"""
    select substr(date, 0,8) as monthyear, substr(date, 9,2) as day, count(*) as game_count from matchups
    where substr(date, 0,8) = '{year}-{month}'
    group by day, monthyear
    order by monthyear, day
    """

    # Execute the query
    db.psy_cursor.execute(query)

    # Fetch results
    results = db.psy_cursor.fetchall()

    # Convert results into a dictionary {day: game_count}
    games_count = {int(day): count for monthyear, day, count in results}
    return JSONResponse(content=games_count)
