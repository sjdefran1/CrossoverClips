from db.get_database import get_db
from scripts.expierements.oldSeasonsClips import getActionNumberToURLs

client = get_db()
db = client['SeasonsV2']
test_season = db['Games']

test_date = '2016-10-25'
games = test_season.find({'date':test_date})

for game in games:
    print(game)