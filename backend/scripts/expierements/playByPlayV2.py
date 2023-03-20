import requests
import json
#from scripts.playByPlay.playbyplayToUrls import getActionNumberToURLs

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

def getActionNumberToURLs(gameID: str, stat_type='FGM') -> dict:
  params = {
      'GameID': gameID, # not required,
      'ContextMeasure': stat_type,
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
  try:
    print(f"Making request to VideoDetail Asset ({stat_type})...")
    response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers, timeout=15)
    print("Request to VideoDetail Asset complete")

  except:
    print("request Timeout")
  #print(response)
  # with open("videos1.txt", "w") as f:
  #   f.write(json.dumps(response.json(), indent=1))
  # print(response.content)

  urls = response.json()['resultSets']['Meta']['videoUrls']
  #print(urls)
  action_hex = {}

  # parse uid for each action number
  for element in urls:
      if element['lurl'] != None:
          # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
          # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          split = element['lurl'].split(f'{gameID}/')[1].split("/")
          action_hex.update({split[0]: split[1]})
  
  #print(json.dumps(action_hex, indent=1))
  #print(action_hex)
  return action_hex

# spurs mavs
#url="https://stats.nba.com/stats/playbyplayv2?EndPeriod=100&GameID=0021400002&StartPeriod=1"

#rockets pels
#0022201067
y = '2023'
m = '03'
d = '19'
game_id = '0022201067'
url=f"https://stats.nba.com/stats/playbyplayv2?EndPeriod=100&GameID={game_id}&StartPeriod=1"
response = requests.get(url=url, headers=headers)

response = response.json()

actions = response['resultSets'][0]['rowSet']
actions_hex = getActionNumberToURLs(gameID=game_id, stat_type='BLK')
#print(actions_hex)
for action in actions:
    #print(action[1])
    action_num_str = f"{action[1]}"
    if action_num_str not in actions_hex:
        continue
    vid_url = f"https://videos.nba.com/nba/pbp/media/{y}/{m}/{d}/{game_id}/{action_num_str}/{actions_hex[action_num_str]}"
    desc = action[9] if action[7] is None else action[7]
    
    
    print(f"{desc} {vid_url}")
      
#print(actions)

# print(json.dumps(response, indent=1))
# f"https://videos.nba.com/nba/pbp/media/2014/10/28/{play['gi']}/{play['ei']}/" + action_hex.get(f"{play['ei']}")
# with open("../../txt/playByPlayV2.txt_2", "w") as f:
#     f.write(json.dumps(response, indent=1))

#print(json.dumps(getActionNumberToURLs(gameID='0021400002'), indent=1))

