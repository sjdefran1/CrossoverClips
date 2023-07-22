from playersUtil.playSql import *  # sql queries
from playersUtil.RequestModels import PlayOptions


def build_plays_query(opts: PlayOptions) -> str:
    """
    Builds sql query string for given options
    """
    ret_query = BASE_QUERY
    delimiter = ""
    # Games vs other teams || specific game
    # cant be both
    if opts.matchup_team_id:
        add_str = MATCHUPS_VERSUS_OPTIONS_SQL.format(
            opts.matchup_team_id, opts.matchup_team_id
        )
        ret_query = delimiter.join([ret_query, add_str])
    elif opts.gid:
        # join matchups w/out worying abt matchup id
        ret_query = delimiter.join([ret_query, DEFAULT_MATCHUPS_JOIN])

        # get certain game
        add_str = GID_OPTIONS_SQL.format(opts.gid)
        ret_query = delimiter.join([ret_query, add_str])
    else:
        # take care of default join w/ matchups
        ret_query = delimiter.join([ret_query, DEFAULT_MATCHUPS_JOIN])

    # Start where clause for pid
    ret_query = delimiter.join([ret_query, BASE_OPTIONS_SQL.format(opts.player_id)])

    # Add Additional options
    # 1) only plays from when player was on specific team
    if opts.team_id:
        add_str = TEAMID_OPTIONS_SQL.format(opts.team_id)
        ret_query = delimiter.join([ret_query, add_str])

    # 2) only by quarter
    if opts.quarter:
        add_str = QUARTER_OPTIONS_SQL.format(opts.quarter)
        ret_query = delimiter.join([ret_query, add_str])

    # 3) only fgm etc
    if opts.stat_type:
        add_str = STAT_TYPE_OPTIONS_SQL.format(opts.stat_type)
        ret_query = delimiter.join([ret_query, add_str])

    # 4) only playoff games or regular szn
    if opts.gtype:
        add_str = GTYPE_OPTIONS_SQL.format(opts.gtype)
        ret_query = delimiter.join([ret_query, add_str])

    if opts.season:
        add_str = SEASON_OPTIONS_SQL.format(opts.season)
        ret_query = delimiter.join([ret_query, add_str])

    if opts.home_away:
        if opts.home_away == "home":
            ret_query = delimiter.join([ret_query, HOME_OPTIONS_SQL])
        elif opts.home_away == "away":
            ret_query = delimiter.join(([ret_query, AWAY_OPTIONS_SQL]))

    # limit
    # ret_query = delimiter.join([ret_query, LIMIT_OPTIONS_SQL.format(opts.limit)])
    return ret_query


if __name__ == "__main__":
    opts_var = PlayOptions(
        player_id=1630209,
        team_id=None,  # if want only when player was on certain team
        matchup_team_id=1610612737,
        limit=1000,
        quarter=4,
    )
