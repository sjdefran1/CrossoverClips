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
  Hidden,
  Button,
  Link,
} from "@mui/material";

import { reqString } from "../../App";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { useNavigate } from "react-router-dom";

export default function VideoFrame(props) {
  /**
   * IFrame utils
   * ---------------------------------------------------------
   */
  const [showProgressBar, setShowProgressBar] = React.useState(null);
  const navigate = useNavigate();
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

    // // user going backwards
    // // get last arr element and move it the front
    // let play = playArrCopy.pop();
    // playArrCopy.unshift(play);

    // update views of next play about to be loaded
    // playArrCopy[0].views = playArrCopy[0].views + 1;
    playArrCopy[props.playArrowIndex].views =
      playArrCopy[props.playArrowIndex].views + 1;
    props.setPlayArr({ plays: playArrCopy });

    props.setPlayArrowIndexFunc(-1);

    // handleView(playArrCopy[0]);
    handleView(playArrCopy[props.playArrowIndex]);
  };

  const handleRightArrowClick = async () => {
    setShowProgressBar(true);
    let playArrCopy = [...props.playArr.plays];
    // move 1st element to end of arr
    // allows for current viewing play to move to top
    // let play = playArrCopy.shift();
    // playArrCopy.push(play);

    // update views of next play about to be loaded
    // playArrCopy[0].views = playArrCopy[0].views + 1;
    playArrCopy[props.playArrowIndex].views =
      playArrCopy[props.playArrowIndex].views + 1;
    // console.log("fired");
    props.setPlayArr({ plays: playArrCopy });
    props.setPlayArrowIndexFunc(1);
    // handleView(playArrCopy[0]);
    handleView(playArrCopy[props.playArrowIndex]);

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

  // updates first play shown view
  // React.useEffect(() => {
  //   let playArrCopy = [...props.playArr.plays];
  //   playArrCopy[0].views = playArrCopy[0].views + 1;
  //   handleView(playArrCopy[0]);
  // }, []);

  return (
    <>
      <Paper variant='outlined' sx={{ textAlign: "center", bgcolor: "#333" }}>
        <Stack
          direction='row'
          justifyContent={"center"}
          spacing={1}
          alignItems={"center"}>
          <Link
            href={
              "#/games/" +
              String(props?.playArr?.plays[props.playArrowIndex].date) +
              "/" +
              String(props?.playArr?.plays[props.playArrowIndex].gid)
            }
            // state={null}
            target='_blank'
            rel='noopener'>
            <IconButton sx={{ borderRadius: 15 }}>
              <Chip
                className='hover-bg-color'
                variant={"outlined"}
                label={"View Full Game"}
                color={"info"}
              />
            </IconButton>
          </Link>

          <Chip
            label={
              props?.playArr
                ? props.playArr.plays[props.playArrowIndex].ptype
                : "..."
            }
            variant='outlined'
            color='primary'
            sx={{ my: 0.5 }}
          />

          <Chip
            label={
              props?.playArr
                ? props.playArr.plays[props.playArrowIndex].sznstr
                : "..."
            }
            variant='outlined'
            color='primary'
            sx={{ my: 0.5 }}
          />
          <Hidden smDown>
            <Switch
              checked={props.bigVideoEnabled}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
            <AspectRatioIcon />
          </Hidden>
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
        <Hidden smDown>
          <IconButton onClick={handleLeftArrowClick}>
            <KeyboardArrowLeftIcon fontSize='large' color='info' />
          </IconButton>
        </Hidden>

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
        <Hidden smDown>
          <IconButton onClick={handleRightArrowClick} sx={{ borderRadius: 5 }}>
            <KeyboardArrowRightIcon fontSize='large' color='info' />
          </IconButton>
        </Hidden>
      </Stack>

      {/* Mobile Controls */}
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
      {/* ----------------------------------- */}
    </>
  );
}
