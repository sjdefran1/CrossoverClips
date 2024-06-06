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
  IconButton,
  Button,
  Avatar,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

import SkipNextIcon from "@mui/icons-material/SkipNext";

import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { useDispatch } from "react-redux";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FileDownload from "@mui/icons-material/FileDownload";
import DownloadButton from "./downloadButton";

import ReactPlayer from "react-player";
import OndemandVideo from "@mui/icons-material/OndemandVideo";

export default function VideoFrame(props) {
  const dispatch = useDispatch();
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  /**
   * IFrame utils
   * ---------------------------------------------------------
   */

  /**
   * Removes rendered progress bar above video
   */
  const handleLoad = () => {
    props.setShowProgressBar(false);
  };

  /**
   * Callback fired when video ends
   * Calls parent function to increase correct slice index
   * @returns
   */
  const handleEnd = () => {
    if (autoPlay) {
      dispatch(props.incrementIndex(1));
    } else {
      return;
    }
  };

  const handleChange = (event) => {
    dispatch(props.setFullscreenVideo(event.target.checked));
  };

  const handleAutoPlay = (event) => {
    console.log(event);
    setAutoPlay(event.target.checked);
    setShowAlert(true);
  };

  React.useEffect(() => {
    // console.log(autoPlay);
  }, [autoPlay]);

  return (
    <>
      <Stack direction={"column"} minWidth={"inherit"}>
        <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
          <Grid container alignItems={"center"}>
            <Grid item xs={8} md={4}>
              {props.location === "player" && (
                <Chip label={props.currentPlay.ptype} />
              )}
              <Chip
                label={
                  props.location === "game" // loaded in a game view, rather than player
                    ? props.currentPlay?.pname
                    : props.currentPlay?.sznstr
                }
                icon={
                  props.location === "game" ? (
                    <Avatar
                      src={
                        "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                        props.currentPlay.playerID +
                        ".png"
                      }
                      sx={{ height: 23, width: 23 }}
                    />
                  ) : undefined
                }
                // variant='outlined'
                // color='primary'
                sx={{ m: 0.5 }}
              />

              {props.location === "game" && (
                <>
                  <Chip
                    label={
                      "Q" +
                      props.currentPlay.quarter +
                      " " +
                      props.currentPlay?.time
                    }
                    // variant='outlined'
                    // color='primary'
                    sx={{ my: 0.5 }}
                  />
                </>
              )}
            </Grid>

            <Grid item xs={3} md={4}>
              <Hidden smUp>
                <DownloadButton
                  url={props.currentPlay?.url}
                  size='small'
                  filename={`Q${
                    props.currentPlay?.quarter
                  }_m${props.currentPlay?.time?.replace(":", "-s")}_${
                    props.currentPlay?.description
                  }.mp4`}
                />
              </Hidden>
            </Grid>
            <Hidden smDown>
              <Grid item xs={4}>
                <Stack direction={"row"} alignItems={"center"}>
                  <AspectRatioIcon />

                  <Switch
                    checked={props.isFullScreen}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  <SkipNextIcon />

                  <Switch checked={autoPlay} onChange={handleAutoPlay} />
                </Stack>
              </Grid>
            </Hidden>
          </Grid>
          {props.showProgressBar && <LinearProgress color='success' />}
        </Paper>
        {/* OLD IFRAME
        <iframe
                title='Full Screen Video'
                id='videoIframe'
                width={"100%"}
                height={720}
                // onLoad={() => setShowProgressBar(false)}
                onLoad={() => handleLoad()}
                src={props.currentUrl}
                frameBorder='0'
                allowFullScreen></iframe> */}

        <Hidden smDown>
          {props.isFullScreen ? (
            // <Fade in={props.isFullScreen}>
            // <div>
            <ReactPlayer
              url={props.currentUrl}
              onReady={handleLoad}
              onEnded={handleEnd}
              playing={autoPlay}
              width='100%'
              height='100%'
              controls
            />
          ) : (
            // </div>
            // </Fade>
            <ReactPlayer
              url={props.currentUrl}
              onReady={handleLoad}
              onEnded={handleEnd}
              playing={autoPlay}
              width='100%'
              height='100%'
              controls
            />
          )}
        </Hidden>

        <Hidden smUp>
          {/* <iframe
            title='Full Screen Video Mobile'
            id='videoIframe'
            width={"100%"}
            height={"360"}
            // onLoad={() => setShowProgressBar(false)}
            onLoad={() => handleLoad()}
            src={props.currentUrl}
            frameBorder='0'
            allowFullScreen></iframe> */}
          <ReactPlayer
            url={props.currentUrl}
            onReady={handleLoad}
            onEnded={handleEnd}
            playing={autoPlay}
            width='100%'
            height='100%'
            controls
          />
        </Hidden>
      </Stack>

      {/* Alert for autoplay set on */}
      <Snackbar
        open={showAlert}
        color='info'
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={4000}
        onClose={() => setShowAlert(false)}>
        <Alert severity='success'>
          Autoplay Enabled, the next highlight will load on finish
        </Alert>
      </Snackbar>
    </>
  );
}
