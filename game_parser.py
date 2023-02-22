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

with open("games_nba_endpoint.txt", "r") as f:
    content = f.read()
    parsed_data = json.loads(content)

#print(json.dumps(parsed_data, indent=1))

#print(parsed_data.keys())

day_games = {}

for day in parsed_data:
    #print(json.dumps(parsed_data.get(day), indent=1))
    games = parsed_data.get(day)
    game_list = []
    for game in games:
        game_list.append({game['gameId']: f"{game['awayTeam']['teamTricode']} @ {game['homeTeam']['teamTricode']}"})
    day_games.update({day: game_list})

print(day_games)