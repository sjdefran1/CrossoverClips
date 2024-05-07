from json import loads
import os

from fastapi import Depends, Request, APIRouter
from fastapi.responses import JSONResponse
from playersUtil.table_schemas import PANDAS_SCHEMA

import psycopg2
import pandas as pd

from dotenv import load_dotenv
from requestModels import PlayByPlayStr, GameId
from routers import pgresdatabase as db

load_dotenv()

playbyplay_router = APIRouter(prefix="/pgres")


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

        return_dict = {
            "game_id": gid,
            "number_quarters": num_quarters,
            "team_ids": team_ids,
            "plays": plays_by_type,
            "players": players,
        }
        return JSONResponse(content=return_dict)
    except Exception as e:
        return None
