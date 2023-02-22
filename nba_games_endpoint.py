"""
Hits nba endpoint for returning all games this year, writes response
to txt file
"""

import requests
import json

data = requests.get("https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json", headers=headers)

data = data.json()
schedule = data.get('leagueSchedule').get('gameDates')
# create dictionary of format {'game-date': gamesList}
schedule_dict = {}
for day in schedule:
    schedule_dict.update({f"{day.get('gameDate')}": day.get('games')})

with open("games_nba_endpoint.txt", "w") as f:
    f.write(json.dumps(schedule_dict))

print(schedule.keys())
