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
    # orders by conf (east, west)
    # sorts by city alph
    sorted_list = sorted(teams, key=lambda x: (x['conf'], x['city']))
    return sorted_list