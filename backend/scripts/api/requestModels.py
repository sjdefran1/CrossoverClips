
from pydantic import BaseModel
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

class TeamSearch(BaseModel):
    teams: list
    seasons: list

class ViewCount(BaseModel):
    gameID: str
