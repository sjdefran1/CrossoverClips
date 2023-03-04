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


def getActionNumberToURLs(gameID: str, stat_type='FGM') -> dict:
  params = {
      'GameID': gameID, # not required,
      'ContextMeasure': stat_type,
      'Month': '0', # required //
      'OpponentTeamID': '0', # required //
      'Period': '0', # required //
      'PlayerID': '0', # required nullable
      #'RangeType': '0', # not required
      'Season': '2013-14', # not required
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

#base_video_url = f'https://videos.nba.com/nba/pbp/media/{year}/{month}/{day}/{gameID}/'


# pre 2019-2020 : playByPlay does not work 
# 2014-2015 : videoAssets still working, before does not it seems

if __name__ == '__main__':
   s = getActionNumberToURLs(gameID="0021300003")
   print(json.dumps(s, indent=1))