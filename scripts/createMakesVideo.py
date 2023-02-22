from playbyplayToUrls import getPlayByPlayWithUrl
from moviepy.editor import VideoFileClip, concatenate_videoclips
import requests
import tempfile
import os
from time import sleep

def main():
    print("getting plays")
    plays = getPlayByPlayWithUrl(gameID='0012200005', year='2022', month='10', day='02')
    print("Got plays")
 
    with tempfile.TemporaryDirectory(prefix="temp_nba_clips_") as temp_dir:
        clips = []
        i = 1
        for play in plays:
            print(f"Getting play ({i}/{len(plays)})\n")
            response = requests.get(plays.get(play))
            clip_filename = os.path.join(temp_dir, f'{i}.mp4')
            with open(clip_filename, 'wb') as f:
                f.write(response.content)
            #print(plays.get(play))
            clip = VideoFileClip(clip_filename)
            clips.append(clip)
            sleep(.5)       
            i += 1
            # if i == 20:
            #     break

        final_clip = concatenate_videoclips(clips)
        # for clip in clips:
        #     clip.close()
        final_clip.write_videofile("celtics_hornets.mp4")


if __name__ == "__main__":
    main()

