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

def get_all_playbyplay_stats_retro(gameID: str, season: str):
   plays_dic = {"FGM":0, "AST":0, "BLK":0, 'DUNK':0, "STL": 0}
   players_dic = {"FGM": [], "AST": [], "BLK": [], "DUNK": [], "STL": []} # no player information in retro apis
   
   fgm = getRetroPlayByPlay(gameID=gameID, season=season, stat_type='FGM')
   teamIDS = fgm['team_ids']
   num_quarters = fgm['number_quarters']

   plays_dic['FGM'] = fgm['plays']
   ast = getRetroPlayByPlay(gameID=gameID, season=season, stat_type='AST')
   
   plays_dic['AST'] = ast['plays']
   
   blk = getRetroPlayByPlay(gameID=gameID, season=season, stat_type='BLK')
   plays_dic['BLK'] = blk['plays']

   dunk = getRetroPlayByPlay(gameID=gameID, season=season, stat_type='FGM', get_dunks=1)
   plays_dic['DUNK'] = dunk['plays']

   stl = getRetroPlayByPlay(gameID=gameID, season=season, stat_type='STL')
   plays_dic['STL'] = stl['plays']


   ret_dict = {
    "game_id": gameID,
    "players": players_dic, 
    "plays": plays_dic,
    "team_ids": teamIDS,
    "number_quarters": num_quarters
   }
   return ret_dict

def getRetroPlayByPlay(gameID: str, season: str, stat_type='FGM', get_dunks=0) -> dict:
  params = {
      'GameID': gameID, # not required,
      'ContextMeasure': stat_type,
      'Month': '0', # required //
      'OpponentTeamID': '0', # required //
      'Period': '0', # required //
      'PlayerID': '0', # required nullable
      #'RangeType': '0', # not required
      'Season': season, # not required
      #'SeasonType': 'Regular Season', # not required
      #'StartPeriod': '0', # not required
      #'StartRange': '0', # not required
      'TeamID': '0', # required //
  }
  try:
    response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers, timeout=15)
  except:
    print("request Timeout")

  urls = response.json()['resultSets']['Meta']['videoUrls']
  plays = response.json()['resultSets']['playlist']
  action_hex = {}

  # parse uid for each action number
  for element in urls:
      if element['lurl'] != None:
          # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
          # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          split = element['lurl'].split(f'{gameID}/')[1].split("/")
          action_hex.update({split[0]: split[1]})
  
  plays_url_desc = []
  for play in plays:
      # check description string for dunks
      if get_dunks == 1:
         if 'Dunk' not in play['dsc']:
            continue
      # create vid url, in try and except incase
      # no url associated with play
      try:
        video_url = f"https://videos.nba.com/nba/pbp/media/{play['y']}/{play['m']}/{play['d']}/{play['gi']}/{play['ei']}/" + action_hex.get(f"{play['ei']}")
      except:
         continue # no clip skip this play
      update_val = {
        "description": play['dsc'],
        "url":  video_url,
        "quarter": play['p'],
        "teamID": None,
        "scoreHome": play['vpa'],
        "scoreAway": play['hpa'],
        "time": None,
        "playerID": None,  
      }
      plays_url_desc.append(update_val)
  
  home_id = plays[-1]['hid']
  away_id = plays[-1]['vid']
  num_quarters = plays[-1]['p']
  ret_dict = {
     "game_id": gameID,
     "players": [],
     "plays": plays_url_desc,
     "team_ids": [home_id, away_id],
     "number_quarters": num_quarters,
  }
  return ret_dict