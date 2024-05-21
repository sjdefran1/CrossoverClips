import { useState } from "react";
import VideoFrame from "../../components/videoFrame";
import { Paper, Stack, Box, IconButton, Hidden, Grid } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { useDispatch, useSelector } from "react-redux";
import { incrementPlayIndex, setFullscreenVideo } from "./playerSlice";

export default function PlayerVideoWrapper() {
  const { currentUrl, currentPagePlays, playIndex, fullScreenVideo } =
    useSelector((state) => state.player);
  const dispatch = useDispatch();
  const [showProgressBar, setShowProgressBar] = useState(null);

  const handleLeftArrowClick = async () => {
    setShowProgressBar(true);
    dispatch(incrementPlayIndex(-1));
  };

  const handleRightArrowClick = async () => {
    setShowProgressBar(true);
    dispatch(incrementPlayIndex(1));
    // handleView(playArrCopy[props.playArrowIndex]);
  };

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Hidden smDown>
          <IconButton onClick={handleLeftArrowClick}>
            <KeyboardArrowLeftIcon fontSize='large' color='info' />
          </IconButton>
        </Hidden>

        <VideoFrame
          currentPlay={currentPagePlays[playIndex]}
          currentUrl={currentUrl}
          setFullscreenVideo={setFullscreenVideo}
          isFullScreen={fullScreenVideo}
          showProgressBar={showProgressBar}
          setShowProgressBar={setShowProgressBar}
        />

        {showProgressBar && <Box minHeight={"47.5vh"} width={"100%"}></Box>}
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