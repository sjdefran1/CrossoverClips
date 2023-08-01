from pydantic import BaseModel
from typing import Optional, Union


class PlayOptions(BaseModel):
    player_id: int
    team_id: Optional[int]  # if want only when player was on certain team
    matchup_team_id: Optional[int]
    limit: Optional[int]
    quarter: Union[None, int]
    stat_type: Optional[str]
    gid: Optional[int]
    gtype: Optional[int]
    season: Optional[str]
    home_away: Optional[str]


class PlayOptionsArrays(BaseModel):
    player_id: int
    team_id: Optional[list[int]]
    matchup_team_id: Optional[list[int]]
    limit: Optional[int]
    quarter: Optional[list[str]]
    stat_type: Optional[list[str]]
    gid: Optional[int]
    gtype: Optional[list[int]]
    season: Optional[list[str]]
    home_away: Optional[list[str]]


class Update(BaseModel):
    url: str
    ptype: str
