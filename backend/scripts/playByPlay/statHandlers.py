from playByPlay.playHelpers import get_time, get_vid_url
# from playHelpers import get_time, get_vid_url


# get assists 0: no, 1: yes
def handle_FGM_or_AST_or_DUNK(action: dict, action_hex: dict, base_video_url: str, get_assits=0, get_dunks=0) -> tuple:
  if(action['isFieldGoal']):
      #print(json.dumps(action, indent=1))
      if(action['shotResult'] == 'Made'):
        act_num = action['actionNumber']
        
        #print(type(action_hex.get(f"{act_num}")))
        # if no clip exists, rare occurence, continue loop
        if action_hex.get(f"{act_num}") is None:
           return
        #print(act_num)

        if get_dunks == 1:
           if 'DUNK' not in action['description']:
              return
           
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


def handle_STL(action: dict, action_hex: dict, base_video_url: str) -> tuple:
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