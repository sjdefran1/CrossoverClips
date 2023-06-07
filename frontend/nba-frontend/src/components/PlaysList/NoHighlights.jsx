import * as React from "react";
import { Typography, Paper, Tooltip, Stack, Box, Fade } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import jordanGif from "../../static/jordan.gif";
//const project = projects[0];
export default function NoHighlights(props) {
  return (
    <>
      <Paper sx={{ mt: 1, textAlign: "center", overflow: "hidden" }}>
        {!props.isPlay ? (
          <>
            <Typography variant='h5' padding={1} color={"text.secondary"}>
              No games on this date
            </Typography>
            <Fade in={true}>
              <img src={jordanGif}></img>
            </Fade>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Tooltip title='Highlight information usually available around 20-30 minutes after game finishes'>
                <InfoIcon color='warning' />
              </Tooltip>
              <Typography variant='h6' color='text.secondary' padding={1}>
                Choose Another Day
              </Typography>
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
