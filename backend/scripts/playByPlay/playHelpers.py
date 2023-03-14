import requests


# Helpers
#----------------------------------------------------------------
def getPlayByPlayJson(gameID):
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
  
  url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
  try:
    print(f"Making request to PlaybyPlay Asset | {gameID}.json")
    response = requests.request("GET", url, headers=headers, timeout=15)
    print("Request to PlaybyPlay Asset complete")
    return response
  except:
    print("request Timeout")
    
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
