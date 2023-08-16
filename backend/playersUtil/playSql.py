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
    "views",
    "downloads",
    "matchupstr",
    "gtype",
    "date",
    "sznstr",
    "htid",
    "atid",
    "game_views",
    "row_number",
    "wl",
    "mid",
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
    m.htid,
    m.atid,
    m.views as game_views,
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
        when m.htid = t.tid then m.atid in {0}
        when m.atid = t.tid then m.htid in {0}
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
and p1.quarter in {}
"""

OVERTIME_OPTIONS_ARRAY_SQL = """
and (p1.quarter in {} or p1.quarter > 4)
"""

OVERTIME_OPTIONS_SQL = """
and p1.quarter > 4
"""

STAT_TYPE_OPTIONS_SQL = """
and p1.ptype in {}
"""

# TODO needs thought
GID_OPTIONS_SQL = """
and p1.gid='{}'
"""

TEAMID_OPTIONS_SQL = """
and p1.tid in {}
"""

GTYPE_OPTIONS_SQL = """
and m.gtype in {}
"""

SEASON_OPTIONS_SQL = """
and m.sznstr in {}
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

ORDER_BY_PLAY_ID_SQL = """
order by playid asc
"""

# --------------------------------------------------------------------

# Sample Player plays

SAMPLE_PLAYS_FOR_PLAYER = """
select distinct 
    p1.*, 
    m.matchupstr,
    m.gtype,
    m.date,
    m.sznstr,
    m.htid,
    m.atid,
    m.views as game_views,
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
    p1.gid = m.gid
where 
    p1.pid={}
and 
    p1.gid=m.gid
order by
    p1.views desc
limit 20;
"""


# Available Games w/ Pts
# ------------------------------

AVAILABLE_GAMES_SQL = """
with RankedPlays AS (
    SELECT
        t.gid,
        t.playid,
        t.description,
        m.matchupstr,
        m.htid,
        m.atid,
        m.sznstr,
        m."HWL",
        m."HPTS",
        m."APTS",
        m.views,
        t.date,
        ROW_NUMBER() OVER (PARTITION BY t.gid ORDER BY t.playid DESC) AS rn,
        case
            when m.atid = t.tid then m."HWL"
            when m.htid = t.tid then m."AWL"
        end as pwl
    FROM
        {} t
    JOIN
        matchups m ON t.gid = m.gid
    WHERE
        t.ptype = 'FGM'
)

SELECT
    gid,
    playid,
    description,
    matchupstr,
    atid,
    htid,
    sznstr,
    "HWL",
    "HPTS",
    "APTS",
    views,
    date,
    pwl
FROM
    RankedPlays
WHERE
    rn = 1
ORDER BY
    playid;
"""


AVAILABLE_GAMES_SQL_2 = """
WITH RankedPlays AS (
     SELECT
        s.gid,
        s.playid,
        s.description,
        m.matchupstr,
        m.htid,
        m.atid,
        m.sznstr,
        m."HWL",
        m."HPTS",
        m."APTS",
        m.views,
        s.date,
        ROW_NUMBER() OVER (PARTITION BY s.gid ORDER BY s.playid DESC) AS rn
    FROM
        {0} s
    JOIN
        matchups m ON s.gid = m.gid
    WHERE
        s.ptype = 'FGM'),
    ast_count AS (
        SELECT s.gid, COUNT(*) AS ast_count
        FROM {0} s
        WHERE s.ptype = 'AST'
        GROUP BY s.gid
    ),
    blk_count AS (
        SELECT s.gid, COUNT(*) AS blk_count
        FROM {0} s
        WHERE s.ptype = 'BLK'
        GROUP BY s.gid
    ), final_query as (

    SELECT
        s.gid,
        s.playid,
        s.description,
        m.matchupstr,
        m.htid,
        m.atid,
        m.sznstr,
        m."HWL",
        m."HPTS",
        m."APTS",
        m.views,
        s.date,
        case
            when m.atid = s.tid then m."HWL"
            when m.htid = s.tid then m."AWL"
        end as pwl,
        COALESCE(ast_count.ast_count, 0) AS ast_count, -- Add AST count with default value 0
        COALESCE(blk_count.blk_count, 0) AS blk_count, -- Add BLK count with default value 0
        ROW_NUMBER() OVER (PARTITION BY s.gid ORDER BY s.playid DESC) AS rn
    FROM
        {0} s
    JOIN
        matchups m ON s.gid = m.gid
    LEFT JOIN
        ast_count ON s.gid = ast_count.gid
    LEFT JOIN
        blk_count ON s.gid = blk_count.gid
    WHERE
        s.ptype = 'FGM'
)
SELECT
    gid,
    playid,
    description,
    matchupstr,
    atid,
    htid,
    sznstr,
    "HWL",
    "HPTS",
    "APTS",
    views,
    date,
    pwl,
    ast_count,
    blk_count
FROM
    final_query
WHERE
    rn = 1
ORDER BY
    playid;

"""

AVAILABLE_GAMES_SQL_3 = """
WITH RankedPlays AS (
     SELECT
        s.gid,
        s.description,
        ROW_NUMBER() OVER (PARTITION BY s.gid ORDER BY s.playid DESC) AS rn
    FROM
        {0} s
    JOIN
        matchups m ON s.gid = m.gid
    WHERE
        s.ptype = 'FGM'),
    ast_count AS (
        SELECT s.gid, COUNT(*) AS ast_count
        FROM {0} s
        WHERE s.ptype = 'AST'
        GROUP BY s.gid
    ),
    blk_count AS (
        SELECT s.gid, COUNT(*) AS blk_count
        FROM {0} s
        WHERE s.ptype = 'BLK'
        GROUP BY s.gid
    ), final_query as (

    SELECT
        s.gid,
        s.playid,
        s.description,
        m.matchupstr,
        m.htid,
        m.atid,
        m.sznstr,
        m."HWL",
        m."HPTS",
        m."APTS",
        m.views,
        s.date,
        case
            when m.atid = s.tid then m."HWL"
            when m.htid = s.tid then m."AWL"
        end as pwl,
        COALESCE(ast_count.ast_count, 0) AS ast_count, -- Add AST count with default value 0
        COALESCE(blk_count.blk_count, 0) AS blk_count, -- Add BLK count with default value 0
        ROW_NUMBER() OVER (PARTITION BY s.gid ORDER BY s.playid DESC) AS rn
    FROM
        {0} s
    JOIN
        matchups m ON s.gid = m.gid
    LEFT JOIN
        ast_count ON s.gid = ast_count.gid
    LEFT JOIN
        blk_count ON s.gid = blk_count.gid
    WHERE
        s.ptype = 'FGM'
)
SELECT
    gid,
    playid,
    description,
    matchupstr,
    atid,
    htid,
    sznstr,
    "HWL",
    "HPTS",
    "APTS",
    views,
    date,
    pwl,
    ast_count,
    blk_count
FROM
    final_query
WHERE
    rn = 1
ORDER BY
    playid;

"""
