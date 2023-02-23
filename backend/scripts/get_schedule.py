import json

def get_schedule() -> dict:
    # League Schedule to json
    with open("../txt/games_nba_endpoint.txt", "r") as f:
        content = f.read()
        parsed_data = json.loads(content)

    # (date) -> [List of Games] 
    day_games = {}
    # For each day create a list of the games for that day
    for day in parsed_data:
        games = parsed_data.get(day)
        game_list = []
        # for each game append to game_list
        # ['gameid', 'tricode vs', 'score'] EX ['0022201213', 'DEN @ UTA', '123-125']
        # Score and tricode vs will always be in format away - home / away @ Home
        for game in games:
            game_list.append( [ game['gameId'], \
                            f"{game['awayTeam']['teamTricode']} @ {game['homeTeam']['teamTricode']}", \
                            f"{game['awayTeam']['score']} - {game['homeTeam']['score']}"])
        # {'09/30/2022':[games list]}
        day_games.update({day.split(" ")[0]: game_list})

    return day_games

def get_games_on_date(date: str):
    sched = get_schedule()
    return sched[date]



# ------------------------------
def main():
    s = get_schedule()
    print(s)

if __name__ == "__main__":
    main()
