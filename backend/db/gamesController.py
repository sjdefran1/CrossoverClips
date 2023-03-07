from db.get_database import get_db

def get_games_on_date_db(date: str):
    client = get_db()
    collection = client['SeasonsV2']['Games']
    for game in collection.find({'date':date}).hint([('date', 1)]):
        print(game)
    return