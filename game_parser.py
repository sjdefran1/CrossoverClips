import json
import requests

# with open("games_2023_list.txt", "r")  as f:
#     content = f.read()
#     parsed_data = json.loads(content)

# GAME_ID = 4
# GAME_DATE = 5
# GAME_VS = 6

# games = {}
# for i in range(0, len(parsed_data), 2):
#     game = parsed_data[i]
#     #print(f"{game[GAME_ID]} {game[GAME_DATE]} {game[GAME_VS]}\n")
#     games.update({game[GAME_ID]: f"{game[GAME_DATE]} {game[GAME_VS]}"})

# print(json.dumps(games, indent=1))

# # date: {"vs":"id"}

# League Schedule to json
with open("games_nba_endpoint.txt", "r") as f:
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

print(day_games)