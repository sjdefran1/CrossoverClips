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

class Update(BaseModel):
    url: str
    ptype: str
