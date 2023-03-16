from db.get_database import get_db

def get_teams(client):
    db = client['TeamsDB']
    collection = db['Teams']
    results = collection.find({}, projection={"_id": False})
    teams = []
    for result in results:
        teams.append(result)
    return teams

if __name__ == '__main__':
    client = get_db()
    print(get_teams(client=client))
