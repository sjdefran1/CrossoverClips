"""
Queries Teams table in db
"""
import operator

def get_teams(client):
    db = client['TeamsDB']
    collection = db['Teams']
    results = collection.find({}, projection={"_id": False})
    teams = []
    for result in results:
        teams.append(result)
    sorted_list = sorted(teams, key=lambda x: (x['conf'], x['city']))
    print(sorted_list)
    return sorted_list