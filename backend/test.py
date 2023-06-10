import requests


r = requests.get("https://videos.nba.com/nba/pbp/media/2023/06/09/0042200404/35/82d1cbb3-6230-3591-2808-92e54dde11fd_1280x720.mp4", params={'responseType':'blob'})

print(r.content)

