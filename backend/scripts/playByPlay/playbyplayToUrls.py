import requests
import json
from time import perf_counter
from playByPlay.statHandlers import handle_BLK, handle_FGM_or_AST
from playByPlay.playHelpers import getPlayByPlayJson

# source C:/Users/sjdef/anaconda3/Scripts/activate base


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

"""
Main function of this file, gets all three stat types and prepares database
play dictionary in format

{
  "game_id": gameid,
  "players": {
    "fgm": [(), (), ..],
    "ast": [(), (), ..],
    "blk": [(), (), ..],
  }
  "plays": {
  "fgm": [{}, {}, ..],
  "ast": [{}, {}, ..],
  "blk": [{}, {}, ..],
  } 
  team_ids: [home, away]
  number_quarters
}
"""
def get_all_playbyplay_stats_normal(gameID, month, day, year):
  start = perf_counter()
  plays_dic = {"FGM":0, "AST":0, "BLK":0}
  players_dic = {"FGM":0, "AST":0, "BLK":0}

  playByPlay_response = getPlayByPlayJson(gameID=gameID)

  fgm = getPlayByPlayWithUrl(response=playByPlay_response, gameID=gameID, month=month, day=day, year=year, stat_type='FGM')
  # store teamids and numquarters for ret_dic since they will be same in all requests
  teamIDS = fgm['team_ids']
  num_quarters = fgm['number_quarters']
  # update our 0'd dictionaries to results
  players_dic['FGM'] = fgm['players']
  plays_dic['FGM'] = fgm['plays']
  
  ast = getPlayByPlayWithUrl(response=playByPlay_response, gameID=gameID, month=month, day=day, year=year, stat_type='AST')
  players_dic['AST'] = ast['players']
  plays_dic['AST'] = ast['plays']
  
  blk = getPlayByPlayWithUrl(response=playByPlay_response, gameID=gameID, month=month, day=day, year=year, stat_type='BLK')
  players_dic['BLK'] = blk['players']
  plays_dic['BLK'] = blk['plays']

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

# working cp3 clips suns
#gameID = '0022200885'

# gameID = '0022200877'
# year = '2023'
# month = '02'
# day = '15'
### -------PlayByPlay--------------------------------------------------------
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

def getPlayByPlayWithUrl(gameID: str, year: str, month: str, day: str, response, stat_type='FGM') -> dict:
  # url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
  # try:
  #   print(f"Making request to PlaybyPlay Asset | {gameID} | stat-type: {stat_type} |...")
  #   response = requests.request("GET", url, headers=headers, timeout=15)
  #   print("Request to PlaybyPlay Asset complete")
  # except:
  #   print("request Timeout")

  json_response = response.json()
  # print(json_response)

  # Gets only each play from the game, excludes meta and headers
  actions = json_response['game']['actions']
  action_hex = getActionNumberToURLs(gameID=gameID, stat_type=stat_type)

  desc_to_url = []
  players_list = []
  ids = []

  # Base highlight url, will be appended to
  base_video_url = f'https://videos.nba.com/nba/pbp/media/{year}/{month}/{day}/{gameID}/'
  for i in range(1, len(actions)):
    action = actions[i]
    # AST
    # ------------------------
    if stat_type == 'AST':
      result = handle_FGM_or_AST(action=action, action_hex=action_hex, base_video_url=base_video_url, get_assits=1)
      if result is not None:
        ids.append(action['teamId'])
        desc_to_url.append(result[0])
        players_list.append(result[1])
        #print(result)
    elif stat_type == 'FGM':
    # FGM -----------------
      result = handle_FGM_or_AST(action=action, action_hex=action_hex, base_video_url=base_video_url)
      if result is not None:
        ids.append(action['teamId'])
        desc_to_url.append(result[0])
        players_list.append(result[1])
    # BLK ---------------------------
    # -----------------------------------
    elif stat_type == 'BLK':
      if(action['actionType'] == 'block'):
        result = handle_BLK(action=action, action_hex=action_hex, base_video_url=base_video_url)
        ids.append(action['teamId'])
        desc_to_url.append(result[0])
        players_list.append(result[1])
        #print(result)
  
  try:
    number_quarters = desc_to_url[-1]['quarter']
  except:
    number_quarters = None
  
  ret_dict = {
    "game_id": gameID,
     "players": list(set(players_list)), # remove dups
     "plays": desc_to_url,
     "team_ids": list(set(ids)),
     "number_quarters": number_quarters
  }
  return ret_dict

# -----------------------------------------
def main():
  #test = getPlayByPlayWithUrl(gameID='0022200908', year='2023', month='02', day='25', stat_type='PTS' )
  test = get_all_playbyplay_stats_normal(gameID='0022200908', year='2023', month='02', day='25')
  print(test)
if __name__ == "__main__":
    main()