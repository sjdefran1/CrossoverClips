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

def getActionNumberToURLs(gameID: str) -> dict:
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

  response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers)

  # with open("videos1.txt", "w") as f:
  #   f.write(json.dumps(response.json(), indent=1))
  # print(response.content)

  urls = response.json()['resultSets']['Meta']['videoUrls']
  action_hex = {}

  # parse uid for each action number
  for element in urls:
      if element['lurl'] != None:
          # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
          # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
          split = element['lurl'].split(f'{gameID}/')[1].split("/")
          action_hex.update({split[0]: split[1]})
  return action_hex

### -------PlayByPlay--------------------------------------------------------
def getPlayByPlayWithUrl(gameID: str, year: str, month: str, day: str) -> dict:
  url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
  response = requests.request("GET", url, headers=headers)
  json_response = response.json()

  # Gets only each play from the game, excludes meta and headers
  actions = json_response['game']['actions']
  action_hex = getActionNumberToURLs(gameID=gameID)
  desc_vid = {}
  desc_vid2 = []

  # Base highlight url, will be appended to
  base_video_url = f'https://videos.nba.com/nba/pbp/media/{year}/{month}/{day}/{gameID}/'
  for action in actions:
    if(action['isFieldGoal']):
      #print(json.dumps(action, indent=1))
      if(action['shotResult'] == 'Made'):
        act_num = action['actionNumber']
        vid_url = base_video_url + f'{act_num}/' + action_hex.get(f"{act_num}")
        #print(f"#{action['actionNumber']} {action['description']} {vid_url}")
        update_val = {
           "description": action['description'],
           "url":  vid_url,
           "quarter": action['period'],
           "teamID": action['teamId'],
           "scoreHome": action['scoreHome'],
           "scoreAway": action['scoreAway'],
        }
       # desc_vid.update({action['description']: vid_url})
        #desc_vid.update({update_val})
        desc_vid2.append(update_val)
  
  #return desc_vid
  return desc_vid2

#print(json.dumps(desc_vid, indent=1))


def main():
  test = getPlayByPlayWithUrl(gameID='0012200005', year='2022', month='10', day='02' )
  print(json.dumps(test, indent=1))



if __name__ == "__main__":
    main()

