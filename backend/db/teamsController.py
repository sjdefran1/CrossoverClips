"""
Queries Teams table in db
"""

def get_teams(client):
    db = client['TeamsDB']
    collection = db['Teams']
    results = collection.find({}, projection={"_id": False})
    teams = []
    for result in results:
        teams.append(result)
    return teams