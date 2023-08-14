from playersUtil.playSql import *  # sql queries
from playersUtil.RequestModels import PlayOptions, PlayOptionsArrays


def build_plays_search_query(opts: PlayOptions) -> str:
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
            ret_query = delimiter.join([ret_query, AWAY_OPTIONS_SQL])

    # order by
    ret_query = delimiter.join([ret_query, ORDER_BY_PLAY_ID_SQL])
    # limit
    # ret_query = delimiter.join([ret_query, LIMIT_OPTIONS_SQL.format(opts.limit)])
    return ret_query


def get_correct_tuple_str(arr: list) -> str:
    """
    python adds a trailing comma when converting list of len 1 to tuple

    eg = ['s'] -> "('s',)" which messes up sql query

    this instead returns ('s')
    """
    if len(arr) == 1:
        # if string need ' '
        if type(arr[0]) == str:
            return f"('{arr[0]}')"
        return f"({arr[0]})"
    else:
        return str(tuple(arr))


def handle_overtime_request(opts: PlayOptionsArrays):
    """
    Frontend request overtime as one thing, but in database it is stored as
    5,6,7...

    If we are requesting other quarters as well we need a different formated
    sql string, if we aren't we can jsut find quarters > 4
    """
    if len(opts.quarter) > 1:
        quarter_copy = opts.quarter.copy()
        quarter_copy.remove("OT")

        # print(opts.quarter.remove("OT"))
        # tuple_wout_ot = tuple(opts.quarter.remove("OT"))
        return OVERTIME_OPTIONS_ARRAY_SQL.format(get_correct_tuple_str(quarter_copy))
    else:
        return OVERTIME_OPTIONS_SQL


def build_plays_search_query_arrays(opts: PlayOptionsArrays) -> str:
    """
    Builds sql query string for given options
    """
    ret_query = BASE_QUERY
    delimiter = ""
    # Games vs other teams || specific game
    # cant be both
    if opts.matchup_team_id:
        add_str = MATCHUPS_VERSUS_OPTIONS_SQL.format(
            get_correct_tuple_str(opts.matchup_team_id)
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
        # always needs to happen
        ret_query = delimiter.join([ret_query, DEFAULT_MATCHUPS_JOIN])

    # Start where clause for pid
    ret_query = delimiter.join([ret_query, BASE_OPTIONS_SQL.format(opts.player_id)])

    # Add Additional options
    # 1) only plays from when player was on specific team
    if opts.team_id:
        add_str = TEAMID_OPTIONS_SQL.format(get_correct_tuple_str(opts.team_id))
        ret_query = delimiter.join([ret_query, add_str])

    # 2) only by quarter
    if opts.quarter:
        add_str = handle_overtime_request(opts=opts)
        ret_query = delimiter.join([ret_query, add_str])

    # 3) only fgm etc
    if opts.stat_type:
        add_str = STAT_TYPE_OPTIONS_SQL.format(get_correct_tuple_str(opts.stat_type))
        ret_query = delimiter.join([ret_query, add_str])

    # 4) only playoff games or regular szn
    if opts.gtype:
        add_str = GTYPE_OPTIONS_SQL.format(get_correct_tuple_str(opts.gtype))
        ret_query = delimiter.join([ret_query, add_str])

    if opts.season:
        add_str = SEASON_OPTIONS_SQL.format(get_correct_tuple_str(opts.season))
        ret_query = delimiter.join([ret_query, add_str])

    if opts.home_away:
        if opts.home_away[0] == "Home":
            ret_query = delimiter.join([ret_query, HOME_OPTIONS_SQL])
        elif opts.home_away[0] == "Away":
            ret_query = delimiter.join(([ret_query, AWAY_OPTIONS_SQL]))

    # order by
    ret_query = delimiter.join([ret_query, ORDER_BY_PLAY_ID_SQL])

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
