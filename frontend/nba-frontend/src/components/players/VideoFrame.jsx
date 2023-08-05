import * as React from "react";
import axios from "axios";
import {
  Paper,
  Stack,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Switch,
  Fade,
} from "@mui/material";

import { reqString } from "../../App";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

export default function VideoFrame(props) {
  /**
   * IFrame utils
   * ---------------------------------------------------------
   */
  const [showProgressBar, setShowProgressBar] = React.useState(null);

  const handleLoad = () => {
    console.log("loaded");
    setShowProgressBar(false);
  };
  const handleChange = (event) => {
    props.setBigVideoEnabled(event.target.checked);
  };

  const handleLeftArrowClick = async () => {
    setShowProgressBar(true);
    let playArrCopy = [...props.playArr.plays];
    // user going backwards
    // get last arr element and move it the front
    let play = playArrCopy.pop();
    playArrCopy.unshift(play);

    // update views of next play about to be loaded
    playArrCopy[0].views = playArrCopy[0].views + 1;
    props.setPlayArr({ plays: playArrCopy });

    props.setPlayArrowIndexFunc(-1);

    // set new url for iframe, and show progress bar to indicate loading
    // props.setCurrentUrl(playArrCopy[0].url);
    handleView(playArrCopy[0]);
  };

  const handleRightArrowClick = async () => {
    setShowProgressBar(true);
    let playArrCopy = [...props.playArr.plays];
    // move 1st element to end of arr
    // allows for current viewing play to move to top
    let play = playArrCopy.shift();
    playArrCopy.push(play);

    // update views of next play about to be loaded
    playArrCopy[0].views = playArrCopy[0].views + 1;
    console.log("fired");
    props.setPlayArr({ plays: playArrCopy });
    props.setPlayArrowIndexFunc(1);
    handleView(playArrCopy[0]);

    // set new url for iframe, and show progress bar to indicate loading
    // props.setCurrentUrl(playArrCopy[0].url);
  };

  const handleView = async (play) => {
    let update = {
      url: play.url,
      ptype: play.ptype,
    };
    let newViewsVal = play.views; // start as currentval
    await axios
      .post(reqString + "players/updatePlayViewCount", update)
      .then((response) => {
        // console.log(response.data.new_val);
        newViewsVal = response.data.new_val;
      })
      .catch(() => {});

    return newViewsVal;
  };

  React.useEffect(() => {
    console.log("Show progress bar changed");
  }, [showProgressBar]);

  return (
    <>
      <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
        <Stack
          direction='row'
          justifyContent={"center"}
          spacing={1}
          alignItems={"center"}>
          <Chip
            label={props?.playArr?.plays[0]?.ptype}
            variant='outlined'
            color='primary'
            sx={{ my: 0.5 }}
          />
          <Chip
            label={props?.playArr?.plays[0]?.matchupstr}
            variant='outlined'
            color='info'
            sx={{ my: 0.5 }}
          />

          <Chip
            label={props?.playArr?.plays[0]?.sznstr}
            variant='outlined'
            color='primary'
            sx={{ my: 0.5 }}
          />
          <Switch
            checked={props.bigVideoEnabled}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />

          <AspectRatioIcon />
        </Stack>
      </Paper>
      {showProgressBar && (
        <Box
          minHeight={props.bigVideoEnabled ? "25vh" : "640"}
          // minWidth={props.bigVideoEnabled ? "720" : "360"}
          // mb={props.bigVideoEnabled ? "250px" : "640px"}
        >
          <LinearProgress color='success' />
        </Box>
      )}
      <Stack direction={"row"} alignItems={"center"} spacing={2} ml={1} my={1}>
        <IconButton onClick={handleLeftArrowClick}>
          <KeyboardArrowLeftIcon fontSize='large' color='info' />
        </IconButton>

        {props.bigVideoEnabled ? (
          <Fade in={props.bigVideoEnabled}>
            <iframe
              id='videoIframe'
              width={!showProgressBar ? "1280" : "0"}
              height={!showProgressBar ? "720" : "0"}
              // onLoad={() => setShowProgressBar(false)}
              onLoad={() => handleLoad()}
              src={props.currentUrl}
              frameBorder='0'
              allowFullScreen></iframe>
          </Fade>
        ) : (
          <Fade in={!props.bigVideoEnabled}>
            <iframe
              id='videoIframe'
              width={!showProgressBar ? "640" : "0"}
              height={!showProgressBar ? "360" : "0"}
              onLoad={() => handleLoad()}
              // onLoad={() => setShowProgressBar(false)}
              src={props.currentUrl}
              frameBorder='0'
              allowFullScreen></iframe>
          </Fade>
        )}

        {showProgressBar && <Box minHeight={"47.5vh"} width={"100%"}></Box>}
        <IconButton onClick={handleRightArrowClick} sx={{ borderRadius: 5 }}>
          <KeyboardArrowRightIcon fontSize='large' color='info' />
        </IconButton>
      </Stack>
    </>
  );
}
