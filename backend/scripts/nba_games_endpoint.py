"""
Hits nba endpoint for returning all games this year, writes response
to txt file
"""

import requests
import json

headers = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Origin': 'https://www.nba.com',
    'Referer': 'https://www.nba.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
}
def update_scores() -> None:
    data = requests.get("https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json", headers=headers)

    data = data.json()
    schedule = data.get('leagueSchedule').get('gameDates')
    # create dictionary of format {'game-date': gamesList}
    schedule_dict = {}
    for day in schedule:
        schedule_dict.update({f"{day.get('gameDate')}": day.get('games')})

    with open("../txt/games_nba_endpoint.txt", "w") as f:
        f.write(json.dumps(schedule_dict))



if __name__ == '__main__':
    update_scores()
