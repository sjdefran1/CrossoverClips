import requests
import json

#url = "https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_0012200005.json"
#url = "https://stats.nba.com/stats/videostatus?GameDate=2020-08-16&LeagueID=00"


# Real app video link, valid
# clippers suns cp putback, action num 670
# url = "https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/670/6be0a86d-9a42-77f1-ba11-3eff01ed185d_1280x720.mp4"

# play by play clippers suns 
#url = "https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_0022200885.json"

#url = "https://stats.nba.com/stats/videoevents?GameEventID=0&GameID=0021700807"

# url = "https://stats.nba.com/stats/videoevents?GameEventID=0&GameID=0021700807"
payload={}
headers = {
  'authority': 'cdn.nba.com',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'max-age=0',
  'if-none-match': '"6db8c4bb1179c7098d7c50081c5626b2"',
  'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
  'Cookie': 'ak_bmsc=52924291846ECFAE51859A76A3ECD7F5~000000000000000000000000000000~YAAQZ6QrFx1Cp/aEAQAA+349BRLJdFaONKYcIARjQEs2xoE0Bi0oXsY1q3MVnqULFzWvPj0GBJVuBObkrgzrXljEFbLchjerIQmpmLxJsw0YUk9AmZ28TchM5+nUtNwlqetsQll0VhZYEByG46YlImbGWBM4qUpk49l1cntT/3Y5W2B3YOQ6Ty41OwUo8XKLX5cQrS66hW5d+unletoj6ddThdemHNa7hZ/IVt/lzxfsGj673LKM8CuYDIzEbyK0+gCT7KFnS2h9ip9xfZdw5SoIhgbEmqJplnSJ43btQlwuXZM8bQ1hihW61dK4x0ZB3ybSaxpwKlbstoJQ5pNxlQJR0DC2YhoD0QWPT83mSHwK6z8vycwWmekykeqA; bm_sv=B1F048A3F03A86DF7DF026AFC8A53188~YAAQZ6QrFx5Cp/aEAQAA+349BRJs3N5jwu1Gs/k0yMIptBir1FmEZSfMMdhqBYuwbE5wSYSxJDjM5M7miHumFo999dfbd6f9ZP7HsgT4F2iA3F9ibQw3gmyhehFkOAlKMZUrn1hhtSFbEfNu8veYDAZcRjzKdhx4eyjrCNjZdJsviWuSXITi65B9QdnsPFAvanVzW8OGy+ThcqhIjK4fjkbmYUvyROtQZ7ghn6+iU7IcJzUXe/y9FTWvryrr~1'
}

# response = requests.request("GET", url, headers=headers, data=payload)
#response = requests.request("GET", url)

#print(json.dumps(response.json(), indent=1))


# download video
# with open("video1.mp4", "wb") as f:
#   f.write(response.content)

# with open("reponse.txt", "w") as f:
#   f.write(json.dumps(response.json(), indent=1))
#print(json.dumps(response.json(), indent=1))

# CLOSEST ATTEMPT
#=-----------------------------------------------------------------------

url = "https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_0022200908.json"

response = requests.request("GET", url, headers=headers, data=payload)

json_response = response.json()

actions = json_response['game']['actions']

makes = []

for action in actions:
  if(action['isFieldGoal']):
    #print(json.dumps(action, indent=1))
    if(action['shotResult'] == 'Made'):
      print(f"#{action['actionNumber']} {action['description']}")
      makes.append(action)


# attempt at looping and getting videos
# hex url at end makes invalid
# i = 0
# for make in makes:
#   action_num = make['actionNumber']
#   #print(action_num)
#   url = f"https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/{action_num}/6be0a86d-9a42-77f1-ba11-3eff01ed185d_1280x720.mp4"
#   response = requests.request("GET", url, headers=headers, data=payload)
#   with open(f"loop{i}.mp4", "wb") as f:
#     f.write(response.content)
#   i += 1

# 
#=================================================================================
# actions file
with open("actions.txt", "w") as f:
  f.write(json.dumps(response.json()['game']['actions'], indent=1))