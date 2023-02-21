import requests
import json

headers_vid = {
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

# params = {
#     'AheadBehind': '',
#     'CFID': '',
#     'CFPARAMS': '',
#     'ClutchTime': '',
#     'Conference': '',
#     'ContextFilter': '',
#     'ContextMeasure': 'FGA',
#     'DateFrom': '',
#     'DateTo': '',
#     'Division': '',
#     'EndPeriod': '0',
#     'EndRange': '31800',
#     'GROUP_ID': '',
#     'GameEventID': '',
#     'GameID': '0022200224',
#     'GameSegment': '',
#     'GroupID': '',
#     'GroupMode': '',
#     'GroupQuantity': '5',
#     'LastNGames': '0',
#     'LeagueID': '00',
#     'Location': '',
#     'Month': '0',
#     'OnOff': '',
#     'OppPlayerID': '',
#     'OpponentTeamID': '0',
#     'Outcome': '',
#     'PORound': '0',
#     'Period': '0',
#     'PlayerID': '1631115',
#     'PlayerID1': '',
#     'PlayerID2': '',
#     'PlayerID3': '',
#     'PlayerID4': '',
#     'PlayerID5': '',
#     'PlayerPosition': '',
#     'PointDiff': '',
#     'Position': '',
#     'RangeType': '0',
#     'RookieYear': '',
#     'Season': '2022-23',
#     'SeasonSegment': '',
#     'SeasonType': 'Regular Season',
#     'ShotClockRange': '',
#     'StartPeriod': '0',
#     'StartRange': '0',
#     'StarterBench': '',
#     'TeamID': '1610612748',
#     'VsConference': '',
#     'VsDivision': '',
#     'VsPlayerID1': '',
#     'VsPlayerID2': '',
#     'VsPlayerID3': '',
#     'VsPlayerID4': '',
#     'VsPlayerID5': '',
#     'VsTeamID': '',
# }



# required // = b''

# Working wiz vs heat
# params = {
#     #'ContextMeasure': 'FGA', # not required
#     #'EndPeriod': '0', # not required
#     #'EndRange': '31800', # not required
#     'GameID': '0022200224', # not required
#     #'GroupQuantity': '5', # not required
#     #'LastNGames': '0', # not required
#     #'LeagueID': '00', # not required
#     'Month': '0', # required //
#     'OpponentTeamID': '0', # required //
#     #'PORound': '0',  # not required
#     'Period': '0', # required //
#     'PlayerID': '1631115', # required nullable
#     #'RangeType': '0', # not required
#     #'Season': '2022-23', # not required
#     #'SeasonType': 'Regular Season', # not required
#     #'StartPeriod': '0', # not required
#     #'StartRange': '0', # not required
#     'TeamID': '1610612748', # required //
# }

# working cp3 clips suns
#gameID = '0022200885'

gameID = '0022200883'
params = {
    'GameID': gameID, # not required,
    'ContextMeasure': 'FGM',
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

response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers_vid)

with open("videos1.txt", "w") as f:
  f.write(json.dumps(response.json(), indent=1))
#print(response.content)

urls = response.json()['resultSets']['Meta']['videoUrls']

#make_urls = []

action_hex = {}


for element in urls:
    if element['lurl'] != None:
        # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
        # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
        # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
        split = element['lurl'].split(f'{gameID}/')[1].split("/")
        action_hex.update({split[0]: split[1]})
        #make_urls.append(element['lurl'])

#print(json.dumps(action_hex, indent=1))

### -------PlayByPlay--------------------------------------------------------
url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
response = requests.request("GET", url, headers=headers_vid)
json_response = response.json()

actions = json_response['game']['actions']

desc_vid = {}

base_video_url = f'https://videos.nba.com/nba/pbp/media/2023/02/16/{gameID}/'
for action in actions:
  if(action['isFieldGoal']):
    #print(json.dumps(action, indent=1))
    if(action['shotResult'] == 'Made'):
      act_num = action['actionNumber']
      vid_url = base_video_url + f'{act_num}/' + action_hex.get(f"{act_num}")
      print(f"#{action['actionNumber']} {action['description']} {vid_url}")
      desc_vid.update({action['description']: vid_url})

#print(json.dumps(desc_vid, indent=1))