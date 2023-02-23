from playbyplayToUrls import getPlayByPlayWithUrl
from moviepy.editor import VideoFileClip, concatenate_videoclips
from get_schedule import get_games_on_date
import requests
import shutil
import os
from time import sleep

def choose_game():
    date = input('enter date month/day/year\nEx(02/04/2023):')
    games = get_games_on_date(date)
    #print(games)

    # {0: ['0022200793', 'WAS @ BKN'], ...}
    games_output = {}
    for i, game in enumerate(games):
        games_output.update({i: game})
        print(f"{i} {game[1]}")
    index = int(input("Choose game based on number next to it:"))
    # ['0022200794', 'PHX @ DET']
    game_chosen = games_output.get(index)
    print(f"You chose {game_chosen[1]}.. Creating Video Now")

    # ['02', '04', '2023']
    split_date = date.split('/')
    create_video(gameID=game_chosen[0], month=split_date[0], \
                day=split_date[1], year=split_date[2], matchup=game_chosen[1])


def create_video(gameID: str, year: str, month: str, day: str, matchup: str):
    print("getting plays")
    plays = getPlayByPlayWithUrl(gameID=gameID, year=year, month=month, day=day)
    print("Got plays")

    dir_path = 'temp_clips_folder_' + matchup
    if not os.path.exists(dir_path):
        # create temp dir
        os.makedirs(dir_path)
        print(f"Directory {dir_path} created")

        # download and append each clip
        clips = []        
        for i, play in enumerate(plays):
            # Request mp4 from nba, download it into temp directory
            print(f"Getting play ({i+1}/{len(plays)})\n")
            response = requests.get(plays.get(play))
            clip_filename = os.path.join(dir_path, f'{i}_vid.mp4')
            with open(clip_filename, 'w+b') as f:
                f.write(response.content)

            # Create video clip w/ downloaded file, append to list
            clip = VideoFileClip(clip_filename)
            clips.append(clip)
            sleep(.5)       
           
        # finally concat all clips together than write final product
        # to mp4s folder
        final_clip = concatenate_videoclips(clips)
        final_file_name = month + '-' + day + '-' + year + '-' + matchup
        final_clip.write_videofile(f"../mp4s/{final_file_name}.mp4")
        
        # CLOSE ALL CLIPS BEFORE DELETING DIRECTORY
        # mind the caps lol
        for clip in clips:
            clip.close()
        final_clip.close()
    
    # delete directory
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path)
        print(f"Directory {dir_path} deleted")

if __name__ == "__main__":
    #create_video(gameID='0012200005', year='2022', month='10', day='02')
    choose_game()
