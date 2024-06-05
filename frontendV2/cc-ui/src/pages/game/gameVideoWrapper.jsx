import { Paper, Stack, IconButton, Hidden } from "@mui/material";
import { useState } from "react";
import VideoFrame from "../../components/videoFrame";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useDispatch, useSelector } from "react-redux";
import { incrementGamePlayIndex, setGameFullscreenVideo } from "./gameSlice";

export default function GameVideoWrapper() {
  const {
    currentUrl,
    currentlyRenderedPlays,
    currentPlayIndex,
    fullScreenVideo,
  } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const [showProgressBar, setShowProgressBar] = useState(null);

  const handleLeftArrowClick = async () => {
    setShowProgressBar(true);
    dispatch(incrementGamePlayIndex(-1));
  };

  const handleRightArrowClick = async () => {
    setShowProgressBar(true);
    dispatch(incrementGamePlayIndex(1));
    // handleView(playArrCopy[props.playArrowIndex]);
  };

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        minWidth={"85%"}
        minHeight={"50vh"}>
        <Hidden smDown>
          <IconButton onClick={handleLeftArrowClick}>
            <KeyboardArrowLeftIcon fontSize='large' color='info' />
          </IconButton>
        </Hidden>

        <VideoFrame
          currentPlay={currentlyRenderedPlays[currentPlayIndex]}
          currentUrl={currentlyRenderedPlays[currentPlayIndex]?.url}
          setFullscreenVideo={setGameFullscreenVideo}
          isFullScreen={fullScreenVideo}
          showProgressBar={showProgressBar}
          setShowProgressBar={setShowProgressBar}
          location={"game"}
        />

        <Hidden smDown>
          <IconButton onClick={handleRightArrowClick} sx={{ borderRadius: 5 }}>
            <KeyboardArrowRightIcon fontSize='large' color='info' />
          </IconButton>
        </Hidden>
      </Stack>

      <Hidden smUp>
        <Paper>
          <Stack direction={"row"} justifyContent={"center"} spacing={10}>
            <IconButton onClick={handleLeftArrowClick}>
              <KeyboardArrowLeftIcon fontSize='large' color='info' />
            </IconButton>
            <IconButton
              onClick={handleRightArrowClick}
              sx={{ borderRadius: 5 }}>
              <KeyboardArrowRightIcon fontSize='large' color='info' />
            </IconButton>
          </Stack>
        </Paper>
      </Hidden>
    </>
  );
}
