"""
Base logic of query

"""
# not same as postgres to reduce refactor on frontend
# many components index the play objects, this takes
# away need to go back and change them all
PLAYS_QUERY_COLUMNS_NAMES = [
    "playid",
    "playerID",
    "gid",
    "description",
    "ptype",
    "url",
    "teamID",
    "scoreHome",
    "scoreAway",
    "time",
    "quarter",
    "matchupstr",
    "gtype",
    "date",
    "sznstr",
    "row_number",
    "wl",
    "mid",
    "views",
    "downloads"
]

# Create view tags
CREATE_VIEW = """
CREATE VIEW {} AS
"""
DROP_VIEW = """
DROP VIEW {}
"""

BASE_QUERY = """
select distinct 
    p1.*, 
    m.matchupstr,
    m.gtype,
    m.date,
    m.sznstr,
    ROW_NUMBER () OVER (ORDER BY p1.pid) AS row_number,
    case
        when m.atid = p1.tid then m."HWL"
        when m.htid = p1.tid then m."AWL"
    end as wl,
    case
        when m.atid = p1.tid then m.htid
        when m.htid = p1.tid then m.atid
    end as mid
from plays p1
join teams t on 
    t.tid=p1.tid
join matchups m on
"""

"""
MATCHUPS

DEFAULT - Just joins every game from plays found
VERSUS - Only joins on games versus opponent team id
"""
DEFAULT_MATCHUPS_JOIN = """
p1.gid = m.gid
"""
MATCHUPS_VERSUS_OPTIONS_SQL = """
    case 
        when m.htid = t.tid then m.atid={}
        when m.atid = t.tid then m.htid={}
    end
"""

"""
DEFAULT START OF WHERE CAUSE

Always comes before and clauses below
Base options - plays from player and games from plays
"""
BASE_OPTIONS_SQL = """
where p1.pid={} and p1.gid=m.gid
"""

"""
AND clauses

Quarter - only plays from certain quarter 
Stat type - only plays of stat type "FGM", "BLK", "DUNK", "STL", "AST'
GID - only plays from certain game
Teamid - only plays while player is on teamid team
GTYPE - Regular Season = 0, Playoffs = 1
"""
QUARTER_OPTIONS_SQL = """
and p1.quarter={}
"""

STAT_TYPE_OPTIONS_SQL = """
and p1.ptype='{}'
"""

GID_OPTIONS_SQL = """
and p1.gid={}
"""

TEAMID_OPTIONS_SQL = """
and p1.tid={}
"""

GTYPE_OPTIONS_SQL = """
and m.gtype={}
"""

SEASON_OPTIONS_SQL = """
and m.sznstr='{}'
"""

HOME_OPTIONS_SQL = """
and m.htid = p1.tid
"""

AWAY_OPTIONS_SQL = """
and m.atid = p1.tid
"""

WIN_LOSE_OPTIONS_SQL = """
and wl='{}'
"""


"""
Extra utils

Limit - Games returned
Group by ??
Etc.
"""
LIMIT_OPTIONS_SQL = """
limit {}
"""


"""

"""
# POSSIBLE SCENARS

"""
------------------------------------------
- All plays from player
    ops:
        (stat-type)
        (quarter)

- All plays from player in season 
    ops: 
        (stat-type) 
        (quarter)

- All plays from player in game 
    opts: 
        (gid) 
        (stat-type) 
        (quarter) 

-----------------------------------------
- All play from player vs matchup 
    opts: 
        (mtid)
        (stat-type) 
        (quarter)

BASE_QUERY = 
select distinct p1.*, p2.fname, p2.lname from plays p1
left join players p2 on p1.pid=p2.pid
join teams t on t.tid=p1.tid

MATCHUPS =
join matchups m on
  case 
        when m.htid = t.tid then m.atid={}
        when m.atid = t.tid then m.htid={}
  end

OPTS_BASE =
where p1.pid={}

OPTS_QUARTER=
AND p1.quarter={}

OPTS_LIMIT=
limit 1000

OPTS_STAT_TYPE=
AND p1.ptype={}

OPTS_SINGLE_GAME=
AND p1.gid={}


"""
