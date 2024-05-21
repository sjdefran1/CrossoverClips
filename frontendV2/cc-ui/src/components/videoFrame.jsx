import * as React from "react";
import {
  Paper,
  Stack,
  Box,
  Chip,
  LinearProgress,
  Switch,
  Fade,
  Hidden,
} from "@mui/material";

import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { useDispatch } from "react-redux";

export default function VideoFrame(props) {
  const dispatch = useDispatch();
  /**
   * IFrame utils
   * ---------------------------------------------------------
   */
  const handleLoad = () => {
    props.setShowProgressBar(false);
  };
  const handleChange = (event) => {
    dispatch(props.setFullscreenVideo(event.target.checked));
  };

  // updates first play shown view
  // TODO: NEED TO UNCCOMENT WHEN BACK IN PROD
  // React.useEffect(() => {
  //   let playArrCopy = [...props.playArr.plays];
  //   playArrCopy[0].views = playArrCopy[0].views + 1;
  //   handleView(playArrCopy[0]);
  // }, []);

  return (
    <>
      <Stack direction={"column"}>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Stack
            direction='row'
            justifyContent={"center"}
            spacing={1}
            alignItems={"center"}>
            <Chip
              label={props.currentPlay ? props.currentPlay.ptype : "..."}
              variant='outlined'
              color='primary'
              sx={{ my: 0.5 }}
            />

            <Chip
              label={props.currentPlay ? props.currentPlay.sznstr : "..."}
              variant='outlined'
              color='primary'
              sx={{ my: 0.5 }}
            />
            <Hidden smDown>
              <Switch
                checked={props.isFullScreen}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <AspectRatioIcon />
            </Hidden>
          </Stack>
          {props.showProgressBar && <LinearProgress color='success' />}
        </Paper>

        {props.isFullScreen ? (
          <Fade in={props.isFullScreen}>
            <iframe
              title='Full Screen Video'
              id='videoIframe'
              width={"1280"}
              height={"720"}
              // onLoad={() => setShowProgressBar(false)}
              onLoad={() => handleLoad()}
              src={props.currentUrl}
              frameBorder='0'
              allowFullScreen></iframe>
          </Fade>
        ) : (
          <Fade in={!props.isFullScreen}>
            <iframe
              title='Minimized Video'
              id='videoIframe'
              width={"640"}
              height={"360"}
              onLoad={() => handleLoad()}
              src={props.currentUrl}
              frameBorder='0'
              allowFullScreen></iframe>
          </Fade>
        )}
      </Stack>
    </>
  );
}
