### Sam DeFrancisco

# NBA Highlight Maker

## Connecting Play By Play to Highlights

The first thing to figure out was how to connect play by play information recieved from one endpoint to highlight information recieved from another.

Each play in a game is defined by an `actionNumber` using this base url

```
url = f"https://cdn.nba.com/static/json/liveData/playbyplay/"
```

We can append on the game id and recieve a large json response for every single play in the game like so

```
url = f"https://cdn.nba.com/static/json/liveData/playbyplay/playbyplay_{gameID}.json"
```

Starting off I decided to just get this working for one game. Suns vs Clippers that had a game ID of `'0022200885'`. Since my plan here was to just create a highlight reel of all makes in a game to start off I passed paramaters in my test like so

```python
gameID = '0022200877'
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
```

`ContextMeasure` filtered to only return play by play for each make in the game. From there I grabbed the action number from the json object to use here in a second.

## Game Clips

```python
base_video_url = f'https://videos.nba.com/nba/pbp/media/{year}/{month}/{day}/{gameID}/{action_number}/{large unique hex string}.mp4'
```

This is an example of what a url for a game clip looks like. The large unique hex string at the end became a roadblock as I had no way of finding any pattern or doc to what they meant. My og plan was to just replace the action_number with the information we got from play-by-play. This was leading to deadend urls b/c of that unique hex string. At first I assumed that string would be the same for the whole game but this was not the case.

In came swars nba api on github. Recently someone discovered the `VideoAssetDetails` endpoint which has information needed for highlight urls. Luckily, it provides those unique hex strings for the url. So now I just needed to match up these urls to the action plays

---

**Getting URLS from stats.nba.com's videodetailAsset**

```py
response = requests.get('https://stats.nba.com/stats/videodetailsasset', params=params, headers=headers)

with open("videos1.txt", "w") as f:
  f.write(json.dumps(response.json(), indent=1))
#print(response.content)

urls = response.json()['resultSets']['Meta']['videoUrls']

#make_urls = []

action_hex = {}

# parse uid for each action number
for element in urls:
    if element['lurl'] != None:
        # 'https://videos.nba.com/nba/pbp/media/2023/02/16/0022200885/9/e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4'
        # ['9/', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
        # ['9', 'e89c8c5a-78bb-4a1d-08af-b36491bffeda_1280x720.mp4']
        split = element['lurl'].split(f'{gameID}/')[1].split("/")
        action_hex.update({split[0]: split[1]})
        #make_urls.append(element['lurl'])
```

Using Pythons split function I created a dictionary that took the form of

```json
{ "actionNumber": "unique_hex_string" }
```

Now we could return to the play by play data from earlier and pair up each play with its highlight url

```python
base_video_url = f'https://videos.nba.com/nba/pbp/media/{year}/{month}/{day}/{gameID}/'
for action in actions:
  if(action['isFieldGoal']):
    #print(json.dumps(action, indent=1))
    if(action['shotResult'] == 'Made'):
      act_num = action['actionNumber']
      vid_url = base_video_url + f'{act_num}/' + action_hex.get(f"{act_num}")
      print(f"#{action['actionNumber']} {action['description']} {vid_url}")
      desc_vid.update({action['description']: vid_url})
```

The description part of the dictionary are just str that describe the play for example

```
J. Tatum 25' 3PT pullup (36 PTS)
```

So our dictionary now contained

```json
{
  "J. Tatum 25' 3PT pullup (36 PTS)": "https://videos.nba.com/nba/pbp/media/2023/02/15/0022200877/453/d6c1e2d1-fb05-0510-5a78-4bfff1fa4b93_1280x720.mp4"
}
```

# Lets Get More Games!

> Obviously we don't want to create all of this just for one game. So first we needed to find the GameIDS for every game that's happened this season

Using the `leaguegamelog` endpoint from stats.nba.com we were able to grab all the games from this season using this url

```python
url = "https://stats.nba.com/stats/leaguegamelog?Counter=0&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=T&Season=2022-23&SeasonType=Regular+Season&Sorter=DATE"
```

Which I then dumped into a text file for parsing, rather than having to make this request multiple more times in the near future

```python
with open("games_2023_test.txt", "w") as f:
    f.write(json.dumps(json_response['resultSets'][0]['rowSet'], indent=1))
```

What we wrote to the text file was a python list of games from the season, rather than a dictionary.

## Parsing

```python
with open("games_2023_list.txt", "r")  as f:
    content = f.read()
    parsed_data = json.loads(content)

GAME_ID = 4
GAME_DATE = 5
GAME_VS = 6

games = {}
for i in range(0, len(parsed_data), 2):
    game = parsed_data[i]
    #print(f"{game[GAME_ID]} {game[GAME_DATE]} {game[GAME_VS]}\n")
    games.update({game[GAME_ID]: f"{game[GAME_DATE]} {game[GAME_VS]}"})
```

Here we have a dictionary that looks like

```json
 {"0022200745": "2023-01-28 LAC @ ATL",...}
```

This isn't really very suitable for the interface I want to end up creating. Instead I want to be able to view all the games from a certain date, and then grab its ID for finding highlights.
