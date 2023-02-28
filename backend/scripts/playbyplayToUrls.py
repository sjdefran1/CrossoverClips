import requests
import json

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

# working cp3 clips suns
#gameID = '0022200885'

# gameID = '0022200877'
# year = '2023'
# month = '02'
# day = '15'

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
    response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers, timeout=15)
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

### -------PlayByPlay--------------------------------------------------------
def getPlayByPlayWithUrl(gameID: str, year: str, month: str, day: str, stat_type='FGM') -> dict:
  url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
  try:
    response = requests.request("GET", url, headers=headers, timeout=15)
  except:
    print("request Timeout")

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

  ret_dict = {
     "players": list(set(players_list)), # remove dups
     "plays": desc_to_url,
     "team_ids": list(set(ids))
  }
  #print(ret_dict)
  return ret_dict


# get assists 0: no, 1: yes
def handle_FGM_or_AST(action: dict, action_hex: dict, base_video_url: str, get_assits=0) -> tuple:
  if(action['isFieldGoal']):
      #print(json.dumps(action, indent=1))
      if(action['shotResult'] == 'Made'):
        act_num = action['actionNumber']
        
        #print(type(action_hex.get(f"{act_num}")))
        # if no clip exists, rare occurence, continue loop
        if action_hex.get(f"{act_num}") is None:
           return
        #print(act_num)
        vid_url = base_video_url + f'{act_num}/' + action_hex.get(f"{act_num}")

        time_str = get_time(action=action)
        # Get information about action, player that made shot
        update_val = {
          "description": action['description'],
          "url":  vid_url,
          "quarter": action['period'],
          "teamID": action['teamId'],
          "scoreHome": action['scoreHome'],
          "scoreAway": action['scoreAway'],
          "time": time_str,
          "playerID": action['personId'],  
        }
        player = (
          action['teamId'],
          action['playerNameI'], action['personId'])
        
        # if requesting assists
        # try to get assister, if exists
        if get_assits == 1:
          try:
            update_val = {
              "description": action['description'],
              "url":  vid_url,
              "quarter": action['period'],
              "teamID": action['teamId'],
              "scoreHome": action['scoreHome'],
              "scoreAway": action['scoreAway'],
              "time": time_str,
              "playerID": action['assistPersonId'],  
            }
            player = (
              action['teamId'],
              action['assistPlayerNameInitial'], action['assistPersonId']
            )
          except:
             print('no assister')
        
        return (update_val, player)
  
  # not a fgm
  return

def handle_BLK(action: dict, action_hex: dict, base_video_url: str) -> tuple:
  time_str = get_time(action=action)
  vid_url = get_vid_url(base_video_url=base_video_url, act_num=action['actionNumber']-1, action_hex=action_hex)
  update_val = {
    "description": action['description'],
    "url":  vid_url,
    "quarter": action['period'],
    "teamID": action['teamId'],
    "scoreHome": action['scoreHome'],
    "scoreAway": action['scoreAway'],
    "time": time_str,
    "playerID": action['personId'],  
  }
  player = (
    action['teamId'],
    action['playerName'], action['personId']
  )
  #print(update_val)
  return (update_val, player)


def get_time(action: dict) -> str:
  # '11M57.00S'   
  time_str = action['clock']
  # '11'
  time_min = time_str.split("PT")[1].split("M")[0]
  # '52.23' || '41'
  time_sec = time_str.split("PT")[1].split("M")[1]
  # if ends in .00 get rid of it, else keep it
  if time_sec.split(".")[1] == '00':
    time_sec = time_str.split("PT")[1].split("M")[1].split(".")[0]

  return f"{time_min}:{time_sec}"

def get_vid_url(base_video_url: str, act_num: str, action_hex: dict) -> str:
  if action_hex.get(f"{act_num}") is None:
    return ""
  vid_url = base_video_url + f'{act_num}/' + action_hex.get(f"{act_num}")
  return vid_url

def main():
  test = getPlayByPlayWithUrl(gameID='0022200908', year='2023', month='02', day='25', stat_type='PTS' )
  #print(json.dumps(test, indent=1))



if __name__ == "__main__":
    main()



# 
# 
# 
# 
# 
# 