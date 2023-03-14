import requests
import json
import asyncio
import aiohttp
from time import perf_counter

# source C:/Users/sjdef/anaconda3/Scripts/activate base
#game_ids = ['0022200877', '0022200885']
url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_0022200877.json"



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
    print("Making request to VideoDetail Asset...")
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


async def get_responses(session, url, isPlayByPlay = False, params={}):
  async with session.get(url=url, params=params) as response:
    print(perf_counter())
    return await response.text()
  
async def create_requests():
    url = 'https://stats.nba.com/stats/videodetailsasset'
    stat_types = ['FGM', 'AST', 'BLK']

    async with aiohttp.ClientSession(headers=headers) as session:
        tasks = []
        gameID = '0022200878'
        # add all stat types urls to task
        for stat in stat_types:
            params = {
                'GameID': gameID, # not required,
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
            tasks.append(asyncio.ensure_future(get_responses(session, url, params)))
        
        # add playbyplay json to tasks
        playbyplayurl = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
        #tasks.append(asyncio.ensure_future(get_responses(session, playbyplayurl)))
        responses = await asyncio.gather(*tasks)
        print(responses)
    return responses

# def handler():
loop = asyncio.get_event_loop()
responses = loop.run_until_complete(create_requests())
    #first = json.loads(responses[1])


# if __name__ == '__main__':
#    handler()