import requests
import json

def filter_stats(stat: str):
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

    params = {
        'GameID': '0022200908', # not required,
        'ContextMeasure': stat,
        'Month': '0', # required //
        'OpponentTeamID': '0', # required //
        'Period': '0', # required //
        'PlayerID': '0', # required nullable
        #'RangeType': '0', # not required
        #'Season': '2022-23', # not required
        #'SeasonType': 'Regular Season', # not required
        #'StartPeriod': '0', # not required
        #'StartRange': '0', # not required
        'TeamID': '0', # required //
    }

    response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers)

    response = response.json()
    #print(json.dumps(response, indent=1))

    with open("../txt/filter.txt", "w") as f:
        f.write(json.dumps(response, indent=1))


if __name__ == '__main__':
    filter_stats('STL')
