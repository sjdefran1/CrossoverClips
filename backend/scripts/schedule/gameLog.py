import requests
import json
import datetime

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

#og
#url = "https://stats.nba.com/stats/leaguegamelog?Counter=0&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=T&Season=2022-23&SeasonType=Regular+Season&Sorter=DATE"

def get_today_json() -> dict:
    season = '2022-23'
    today = str(datetime.date.today())
    #today = '2023-03-10'
    print(today)
    url = f"https://stats.nba.com/stats/leaguegamelog?Counter=0&DateFrom={today}&DateTo={today}&Direction=ASC&LeagueID=00&PlayerOrTeam=T&Season={season}&SeasonType=Regular+Season&Sorter=DATE"
    response = requests.get(url, headers=headers)
    json_response = response.json()
    return json_response

def get_season_json(season: str) -> dict:
    #Older szns url
    url = f"https://stats.nba.com/stats/leaguegamelog?Counter=0&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=T&Season={season}&SeasonType=Regular+Season&Sorter=DATE"

    response = requests.get(url, headers=headers)

    json_response = response.json()
    with open("../txt/games_2019_test.txt", "w") as f:
        f.write(json.dumps(json_response, indent=1))
    return json_response

# if today = 0 gets season, if 1 gets only today
def parse_season_json(season: str, today=0) -> dict:
    if today == 0:
        season_json = get_season_json(season)
    else:
        season_json = get_today_json()
    stat_headers = season_json['resultSets'][0]['headers']
    game_list = season_json['resultSets'][0]['rowSet']

    #parsed_game_list = []
    season_game_dict = {}
    for game in game_list:
        game_id = game[4]
        game_dic = {
            "TEAM_ID":game[1],
            "TEAM_ABBREVIATION":game[2],
            "TEAM_NAME":game[3],
            "GAME_ID":game[4],
            "GAME_DATE":game[5],
            "MATCHUP":game[6],
            "WL":game[7],
            "MIN":game[8],
            "FGM":game[9],
            "FGA":game[10],
            "FG_PCT":game[11],
            "FG3M":game[12],
            "FG3A":game[13],
            "FG3_PCT":game[14],
            "FTM":game[15],
            "FTA":game[16],
            "FT_PCT":game[17],
            "OREB":game[18],
            "DREB":game[19],
            "REB":game[20],
            "AST":game[21],
            "STL":game[22],
            "BLK":game[23],
            "TOV":game[24],
            "PF":game[25],
            "PTS":game[26],
        }
        # test
        # init list if not in their yet
        if game_id not in season_game_dict:
            season_game_dict[game_id] = {}
        
        # away team has @ in matchup string
        if "@" in game[6]:
            season_game_dict[game_id].update({'away': game_dic})
        else:
            season_game_dict[game_id].update({'home': game_dic})
            
    ret_list = organize_dict(season_games=season_game_dict)
    #print(ret_list)
    return ret_list

def organize_dict(season_games:dict) -> list:
    game_list = []
    for game_id in season_games:
        game_info = season_games.get(game_id)
        complete_game_dict = {
            'game_id': game_id,
            'date': game_info['home']['GAME_DATE'],
            'home_info': game_info['home'],
            'away_info': game_info['away']
        }
        game_list.append(complete_game_dict)
    return game_list

# with open("../txt/games_2013_test.txt", "w") as f:
#     f.write(json.dumps(json_response, indent=1))

if __name__ == '__main__':
    #s = parse_season_json(season='2019-20')
    print(get_today_json())
    # with open("../txt/games_2015_test.txt", "w") as f:
    #     f.write(json.dumps(s, indent=1))
    #print(json.dumps(s, indent=1))
    # print(get_today_json())
    