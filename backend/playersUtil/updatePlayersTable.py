from nba_api.stats.static import players
import psycopg2
import os
from dotenv import load_dotenv
from time import sleep
import requests

load_dotenv()

psyconn = psycopg2.connect(
    host=os.getenv("NEONHOST"),
    port=os.getenv("NEONPORT"),
    user=os.getenv("USER"),
    database=os.getenv("DATABASE"),
    password=os.getenv("PASSWORD"),
)


req_headers = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Origin": "https://www.nba.com",
    "Referer": "https://www.nba.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
}


def get_player_common_info(player_id: int):
    try:
        url = f"https://stats.nba.com/stats/commonplayerinfo?LeagueID=&PlayerID={player_id}"
        response = requests.get(url=url, headers=req_headers)
        result = response.json()

        attrs_labels = result["resultSets"][0]["headers"]
        attrs_values = result["resultSets"][0]["rowSet"][0]

        attr_remaps = {
            "PERSON_ID": "pid",
            "FIRST_NAME": "fname",
            "LAST_NAME": "lname",
            "SEASON_EXP": "yrsplayed",
            "JERSEY": "jerseynum",
            "POSITION": "pos",
            "ROSTERSTATUS": "status",
            "TEAM_ID": "tid",
            "GREATEST_75_FLAG": "goatflag",
        }
        attr_dict = {}
        # Common attributes (name, id, jersey etc)
        for i, header in enumerate(attrs_labels):
            try:
                remap_val = attr_remaps[header]
                attr_dict[remap_val] = (
                    attrs_values[i] if attrs_values[i] != "" else None
                )

            except:  # header not included in remap, move on
                pass
        attr_dict["views"] = 0
        return attr_dict
    except Exception as e:
        print(e)
        print(f"{player_id} Failed")
        return None


def main():
    cursor = psyconn.cursor()
    cursor.execute("select pid from players")
    active_ids = [record[0] for record in cursor.fetchall()]
    ids_to_add = []
    # find new player ids
    active_players_from_api = players.get_active_players()
    for player in active_players_from_api:
        if player["id"] not in active_ids:
            ids_to_add.append(player["id"])

    for id in ids_to_add:
        temp_player = get_player_common_info(id)
        query = """
        insert into players (pid, fname, lname, yrsplayed, jerseynum, pos, status, tid, goatflag, views)
        values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, tuple(temp_player.values()))
        print(
            f"{temp_player['pid']} inserted {temp_player['fname'] + ' ' + temp_player['lname']}"
        )
        sleep(0.5)
    psyconn.commit()


# def update_player_tid():

#     for player in players.get_active_players():
#         update_query = f'UPDATE players SET tid={player[""]}'


if __name__ == "__main__":
    main()
