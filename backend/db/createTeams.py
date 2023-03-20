from nba_api.stats.static.teams import get_teams
import json
from db.get_database import get_db


def create_teams():
    client=get_db()
    db = client['TeamsDB']
    collection = db['Teams']
    collection.insert_many(get_teams())
        
if __name__ == '__main__':
    create_teams()