import requests
import json
from time import perf_counter, sleep
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
    return
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

def getPlayByPlayV2Json(game_id: str):
  url=f"https://stats.nba.com/stats/playbyplayv2?EndPeriod=100&GameID={game_id}&StartPeriod=1"
  response = requests.get(url=url, headers=headers)
  response = response.json()
  return response

# spurs mavs
#url="https://stats.nba.com/stats/playbyplayv2?EndPeriod=100&GameID=0021400002&StartPeriod=1"
def get_all_stats_V2(gameID, response, fgm, m, d, y):
  start = perf_counter()
  plays_dic = {"FGM":0, "AST":0, "BLK":0, "DUNK": 0, "STL": 0}
  players_dic = {"FGM":0, "AST":0, "BLK":0, "DUNK":0, "STL": 0}

  # store teamids and numquarters for ret_dic since they will be same in all requests
  teamIDS = fgm['team_ids']
  num_quarters = fgm['number_quarters']
  # update our 0'd dictionaries to results
  players_dic['FGM'] = fgm['players']
  plays_dic['FGM'] = fgm['plays']

  sleep(.5)
  dunk = playByPlayV2Urls(response=response, game_id=gameID, m=m, d=d, y=y, stat_type='DUNK')
  players_dic['DUNK'] = dunk['players']
  plays_dic['DUNK'] = dunk['plays']
  
  sleep(.5)
  ast = playByPlayV2Urls(response=response, game_id=gameID, m=m, d=d, y=y, stat_type='AST')
  players_dic['AST'] = ast['players']
  plays_dic['AST'] = ast['plays']

  sleep(.5)
  blk = playByPlayV2Urls(response=response, game_id=gameID, m=m, d=d, y=y, stat_type='BLK')
  players_dic['BLK'] = blk['players']
  plays_dic['BLK'] = blk['plays']

  sleep(.5)
  stl = playByPlayV2Urls(response=response, game_id=gameID, m=m, d=d, y=y, stat_type='STL')
  players_dic['STL'] = stl['players']
  plays_dic['STL'] = stl['plays']

  ret_dict = {
    "game_id": gameID,
    "players": players_dic, 
    "plays": plays_dic,
    "team_ids": teamIDS,
    "number_quarters": num_quarters
  }
  end = perf_counter()
  print(f"Execution time for PlayByPlay Normal: {end-start:.6f}\n")
  return ret_dict




#rockets pels
#0022201067
def playByPlayV2Urls(y, m, d, game_id, stat_type, response):
  # url=f"https://stats.nba.com/stats/playbyplayv2?EndPeriod=100&GameID={game_id}&StartPeriod=1"
  # response = requests.get(url=url, headers=headers)

  # response = response.json()

  actions = response['resultSets'][0]['rowSet']
  actions_hex = None
  while actions_hex is None:
    if stat_type=="DUNK":
      actions_hex = getActionNumberToURLs(gameID=game_id, stat_type='FGM')
    else:
      actions_hex = getActionNumberToURLs(gameID=game_id, stat_type=stat_type)
    if actions_hex is None:
       print("-" * 50)
       print("[PlayByPlay Debug] ACTIONS HEX WAS NONE RETRYING")
       print("-" * 50)
  # # messed up response, try again
  # if actions_hex is None:
  #   sleep(1)
  #   if stat_type=="DUNK":
  #     actions_hex = getActionNumberToURLs(gameID=game_id, stat_type='FGM')
  #   else:
  #     actions_hex = getActionNumberToURLs(gameID=game_id, stat_type=stat_type)

  desc_to_url = []
  players_list = []
  ids = []


  #print(actions_hex)
  for action in actions:
      #print(action[1])
      action_num_str = f"{action[1]}"
      if action_num_str not in actions_hex:
          continue
      vid_url = f"https://videos.nba.com/nba/pbp/media/{y}/{m}/{d}/{game_id}/{action_num_str}/{actions_hex[action_num_str]}"
      
      if stat_type=='FGM':
        result = handle_FGM_or_DUNK(action=action, video_url=vid_url)
        if result is not None: 
          ids.append(action[15]) # not a fan of this
          desc_to_url.append(result[0])
          players_list.append(result[1])

      elif stat_type=='DUNK':
        result = handle_FGM_or_DUNK(action=action, video_url=vid_url, get_dunks=1)
        if result is not None: 
          ids.append(action[15]) 
          desc_to_url.append(result[0])
          players_list.append(result[1])

      elif stat_type=='AST':
        result = handle_AST(action=action, video_url=vid_url)
        if result is not None: 
          ids.append(action[15]) 
          desc_to_url.append(result[0])
          players_list.append(result[1])

      elif stat_type=='BLK':
        result = handle_BLK(action=action, video_url=vid_url)
        if result is not None: 
          ids.append(action[15]) 
          desc_to_url.append(result[0])
          players_list.append(result[1])

      elif stat_type=='STL':
        result = handle_STL(action=action, video_url=vid_url)
        if result is not None: 
          ids.append(action[15])
          desc_to_url.append(result[0])
          players_list.append(result[1])
      # desc = action[9] if action[7] is None else action[7]
      # print(f"{desc} {vid_url}")

  try:
    number_quarters = desc_to_url[-1]['quarter']
  except:
    number_quarters = None

  ret_dict = {
    "game_id": game_id,
     "players": list(set(players_list)), # remove dups
     "plays": desc_to_url,
     "team_ids": list(set(ids)),
     "number_quarters": number_quarters
  }
  return ret_dict


def handle_FGM_or_DUNK(action: dict, video_url: str, get_dunks=0) -> tuple:
    desc = action[9] if action[7] is None else action[7] # home desc or away desc
    if get_dunks == 1:
        if 'Dunk' not in desc:
          return
    # Get information about action, player that made shot
    # see playbyplayv2headers.txt in txt folder for index information
    update_val = {
      "description": desc,
      "url":  video_url,
      "quarter": action[4],
      "teamID": action[15],
      "scoreHome": action[10], # duplicate scores for now
      "scoreAway": action[10],
      "time": action[6],
      "playerID": action[13],  
    }
    player = (
      action[15],
      action[14], action[13])
    
    return (update_val, player)

#  0021700211
def handle_STL(action: dict, video_url: str):
    # get description about steal, not turnover
    try:
      desc = action[7] if ('STEAL' in action[7]) else action[9] 
    except:
       return
    # Get information about action, player that made shot
    # see playbyplayv2headers.txt in txt folder for index information
    update_val = {
      "description": desc,
      "url":  video_url,
      "quarter": action[4],
      "teamID": action[22],
      "scoreHome": action[10], # duplicate scores for now
      "scoreAway": action[10],
      "time": action[6],
      "playerID": action[20],  
    }
    player = (
      action[22],
      action[21], action[20])
    return (update_val, player)

def handle_BLK(action: dict, video_url: str):
    # get desc about block, not missed shot
    desc = action[7] if ('BLOCK' in action[7]) else action[9] 
    # Get information about action, player that made shot
    # see playbyplayv2headers.txt in txt folder for index information
    update_val = {
      "description": desc,
      "url":  video_url,
      "quarter": action[4],
      "teamID": action[29],
      "scoreHome": action[10], # duplicate scores for now
      "scoreAway": action[10],
      "time": action[6],
      "playerID": action[27],  
    }
    player = (
      action[29],
      action[28], action[27])
    return (update_val, player)


def handle_AST(action: dict, video_url: str):
    desc = action[9] if action[7] is None else action[7] # home desc or away desc
    # Get information about action, player that made shot
    # see playbyplayv2headers.txt in txt folder for index information
    update_val = {
      "description": desc,
      "url":  video_url,
      "quarter": action[4],
      "teamID": action[22],
      "scoreHome": action[10], # duplicate scores for now
      "scoreAway": action[10],
      "time": action[6],
      "playerID": action[20],  
    }
    player = (
      action[22],
      action[21], action[20]
    )
    return (update_val, player)

if __name__ == '__main__':
  y = '2023'
  m = '03'
  d = '19'
  stat_type = 'STL'
  game_id = '0022201067'
  print(playByPlayV2Urls(y=y, m=m, d=d, game_id=game_id, stat_type=stat_type))
#print(actions)

# print(json.dumps(response, indent=1))
# f"https://videos.nba.com/nba/pbp/media/2014/10/28/{play['gi']}/{play['ei']}/" + action_hex.get(f"{play['ei']}")
# with open("../../txt/playByPlayV2.txt_2", "w") as f:
#     f.write(json.dumps(response, indent=1))

#print(json.dumps(getActionNumberToURLs(gameID='0021400002'), indent=1))


# weird response stuff

# block 1st player who got blocked, 2nd null, 3rd blocker
# ast 1st player scorer, 2nd assister, 3rd null
# steal 1st player turnoverer, 2nd stealer


# single play goal
# ---------------------
# update_val = {
#   "description": action['description'],
#   "url":  vid_url,
#   "quarter": action['period'],
#   "teamID": action['teamId'],
#   "scoreHome": action['scoreHome'],
#   "scoreAway": action['scoreAway'],
#   "time": time_str,
#   "playerID": action['personId'],  
# }
# player = (
#   action['teamId'],
#   action['playerNameI'], action['personId']
# )
# -------------------------------------


# overall return goal
# ---------------------
# ret_dict = {
#   "game_id": gameID,
#     "players": list(set(players_list)), # remove dups
#     "plays": desc_to_url,
#     "team_ids": list(set(ids)),
#     "number_quarters": number_quarters
# }