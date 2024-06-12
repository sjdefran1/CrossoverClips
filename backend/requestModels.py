"""
Classes that define structure for incoming json requests from frontend
Used by fastapi async methods in main.py

Possible values included for each field
"""
from pydantic import BaseModel
# -----------------------------------------------------
# Data Models for json Requests
# used in main.py
# ---------------------------------
class DateStr(BaseModel):
    value: str # 'YYYY-MM-DD'

class PlayByPlayStr(BaseModel):
    gameID: str # '01001216'
    # date: str # 'YYYY-MM-DD'
    # statType: str # 'FGM' || 'STL' || 'BLK' || 'DUNK' || 'AST' 

class GameInfo(BaseModel):
    date: str # 'YYYY-MM-DD'
    gameID: str # '01001216'

class TeamSearch(BaseModel):
    teams: list # [teamid1, teamid2] || [teamid1, None]
    seasons: list # ['2020-21', '2021-22']
    game_type: str # 'playoff' || 'regular season' || '' = all

class ViewCount(BaseModel):
    gameID: str # '0' should probably just be an interger (fix)

class UrlStr(BaseModel):
    url: str

class GameId(BaseModel):
    gid: str

class MonthYear(BaseModel):
    month: str
    year: str