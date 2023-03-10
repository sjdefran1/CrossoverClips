import * as React from "react";
import { Typography, Paper, Tooltip, Stack, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import jordanGif from "../../static/jordan.gif";
//const project = projects[0];
export default function NoHighlights(props) {
  return (
    <>
      <Paper sx={{ mt: 1, textAlign: "center" }}>
        {!props.isPlay ? (
          <>
            <Typography variant='h5' padding={1}>
              No highlight information available yet
            </Typography>
            <img src={jordanGif}></img>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Tooltip title='Highlight information usually available around 20-30 minutes after game finishes'>
                <InfoIcon color='warning' />
              </Tooltip>
              <Typography variant='h6' color='text.secondary' padding={1}>
                Please check back soon
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            <img src={jordanGif}></img>
            <Stack
              direction={"row"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant='h5' color={"text.secondary"} padding={1}>
                No results found, try changing quarters!
              </Typography>
              <Tooltip title='Based on your current filter, there are no plays during this quarter. Try changing quarters above, or changing up your filter'>
                <InfoIcon color='warning' />
              </Tooltip>
            </Stack>
          </>
        )}
      </Paper>
    </>
  );
}
