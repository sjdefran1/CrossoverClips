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

def games_info_by_date(year: str, month: str, day: str) -> dict:
    response = requests.get(f'https://stats.nba.com/stats/scoreboardv2?DayOffset=0&GameDate={year}-{month}-{day}&LeagueID=00', headers=headers)
    res_json = response.json()
    # with open("../txt/scoreboard.txt", 'r') as f:
    #     content = f.read()
    #     res_json = json.loads(content)

    line_score = res_json['resultSets'][1]['rowSet']

    games = {}
    for i in range(1, len(line_score), 2):
        home_stats = line_score[i]
        away_stats = line_score[i-1]
        game_id = away_stats[2]
        game_info = {
            "home_city" : f"{home_stats[5]}",
            "home_name" : f"{home_stats[6]}",
            "away_city": f"{away_stats[5]}",
            "away_name": f"{away_stats[6]}",
            "home_teamID": home_stats[3],
            "away_teamID": away_stats[3],
            "home_tri": home_stats[4],
            "away_tri": away_stats[4],
            "home_record": home_stats[7],
            "away_record": away_stats[7],
            "home_pts": home_stats[22],
            "away_pts": away_stats[22],
            "home_fgpct": "{:.1f}%".format(home_stats[23] * 100),
            "away_fgpct": "{:.1f}%".format(away_stats[23] * 100),
            "home_ftpct": "{:.1f}%".format(home_stats[24] * 100),
            "away_ftpct": "{:.1f}%".format(away_stats[24] * 100),
            "home_3pct": "{:.1f}%".format(home_stats[25] * 100),
            "away_3pct": "{:.1f}%".format(away_stats[25] * 100),
            "home_ast": home_stats[26],
            "away_ast": away_stats[26],
            "home_reb": home_stats[27],
            "away_reb": away_stats[27],
            "home_tov": home_stats[28],
            "away_tov": away_stats[28]
        }
        games.update({game_id: game_info})
    return games

def get_game_info(gameID: str, year: str, month: str, day: str) -> dict:
    games = games_info_by_date(year=year, month=month, day=day)
    return games[f'{gameID}']



# with open("../txt/scoreboard.txt", "w") as f:
#     f.write(json.dumps(res_json, indent=1))