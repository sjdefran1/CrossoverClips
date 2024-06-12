from db.get_database import get_db_client_connection
from json import dump


def make_playbyplay_backup():
    db = get_db_client_connection()
    play_by_play = db["PlayByPlay"]
    games = play_by_play["Games"].find(projection={"_id": False})

    with open("playByPlayMongoBackup.json", "w+") as f:
        for i, game in enumerate(games):
            print(f"{i}/10,928")
            dump(game, f)


if __name__ == "__main__":
    make_playbyplay_backup()
