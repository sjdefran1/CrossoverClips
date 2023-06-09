import * as React from "react";
import {
  Typography,
  Paper,
  Tooltip,
  Stack,
  Box,
  Fade,
  AppBar,
  Toolbar,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DateChosenDash from "../DateChosenDash";

import jordanGif from "../../static/jordan.gif";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";

//const project = projects[0];
export default function NoHighlights(props) {
  const { date } = useParams();
  return (
    <>
      <Paper sx={{ mt: 2, textAlign: "center", overflow: "hidden" }}>
        {!props.isPlay ? (
          <>
            {/* <AppBar position='static' sx={{ borderRadius: 1 }}>
              <Toolbar sx={{ justifyContent: "center" }}>
                {" "} */}
            {/* <Paper elevation={5}>
              <Typography variant='h5' padding={1}>
                No games found
              </Typography> */}

            <Fade in={true} timeout={600}>
              <div>
                {!props.isGameSelect && (
                  <DateChosenDash gamesFound={0} isDate={true} date={date} />
                )}
                <img src={jordanGif}></img>
              </div>
            </Fade>

            {date !== dayjs().format("YYYY-MM-DD").toString() &&
              !props.isGameSelect && (
                <>
                  {/* <br></br>
                  <br></br> */}
                </>
              )}
            {/* </Toolbar>
            </AppBar> */}

            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              {props.isGameSelect && (
                <>
                  <Tooltip title=''>
                    <InfoIcon color='warning' />
                  </Tooltip>
                  <Typography
                    variant='body1'
                    color={"text.secondary"}
                    padding={1}>
                    No results
                  </Typography>
                </>
              )}
            </Stack>
          </>
        ) : (
          <>
            <br></br>
            <img src={jordanGif}></img>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Tooltip title='Based on your current filter, there are no plays during this quarter. Try changing quarters above, or changing up your filter'>
                <InfoIcon color='warning' />
              </Tooltip>
              <Typography variant='h5' color={"text.secondary"} padding={1}>
                No results found, try changing quarters!
              </Typography>
            </Stack>
            <br></br>
          </>
        )}
      </Paper>
    </>
  );
}
