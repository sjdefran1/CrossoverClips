from playByPlay.playbyplayToUrls import getPlayByPlayWithUrl
from moviepy.editor import VideoFileClip, concatenate_videoclips
#from game_list_for_date import choose_game
import requests
import shutil
import os
from time import sleep


def create_video(gameID: str, year: str, month: str, day: str, matchup: str):
    print("getting plays")
    plays = getPlayByPlayWithUrl(gameID=gameID, year=year, month=month, day=day)
    plays = plays['plays']
   # print(plays)
    print("Got plays")

    dir_path = 'temp_clips_folder_' + matchup
    if not os.path.exists(dir_path):
        # create temp dir
        os.makedirs(dir_path)
        print(f"Directory {dir_path} created")
        # download and append each clip
        clips = []        
        for i, play in enumerate(plays):
            #print(play)
            # Request mp4 from nba, download it into temp directory
            print(f"Getting play ({i+1}/{len(plays)})\n")
            response = requests.get(play.get('url'))
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
    create_video(gameID='0022200917', year='2023', month='02', day='26', matchup='PORvsHou')
    #choose_game(create_video_yn='y')
