import json

def get_schedule():
    # League Schedule to json
    with open("../txt/games_nba_endpoint.txt", "r") as f:
        content = f.read()
        parsed_data = json.loads(content)

    # Day -> Games Dictionary
    day_games = {}
    # For each day create a list of the games for that day
    for day in parsed_data:
        games = parsed_data.get(day)
        game_list = []
        # for each game append to game_list
        # {gameID: "away @ home"} EX {'0022201213': 'DEN @ UTA'}
        for game in games:
            game_list.append({game['gameId']: f"{game['awayTeam']['teamTricode']} @ {game['homeTeam']['teamTricode']}"})
        # {'09/30/2022':[games list]}
        day_games.update({day.split(" ")[0]: game_list})

    return day_games