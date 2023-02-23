from get_schedule import get_games_on_date
from createMakesVideo import create_video

def choose_game(create_video_yn: str):
    date = input('enter date month/day/year\nEx(02/04/2023):')
    games = get_games_on_date(date)
    #print(games)

    # {0: ['0022200793', 'WAS @ BKN'], ...}
    games_output = {}
    for i, game in enumerate(games):
        games_output.update({i: game})
        print(f"{i} {game[1]}\n  {game[2]}")
    index = int(input("Choose game based on number next to it:"))
    # ['0022200794', 'PHX @ DET']
    game_chosen = games_output.get(index)
    print(f"You chose {game_chosen[1]}.. Creating Video Now")

    # ['02', '04', '2023']
    split_date = date.split('/')

    if create_video_yn == 'y':
        create_video(gameID=game_chosen[0], month=split_date[0], \
                    day=split_date[1], year=split_date[2], matchup=game_chosen[1])
    else:
        return
