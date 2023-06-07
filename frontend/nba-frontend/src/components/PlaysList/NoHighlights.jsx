import * as React from "react";
import { Typography, Paper, Tooltip, Stack, Box, Fade } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import jordanGif from "../../static/jordan.gif";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

//const project = projects[0];
export default function NoHighlights(props) {
  const { date } = useParams();
  return (
    <>
      <Paper sx={{ mt: 1, textAlign: "center", overflow: "hidden" }}>
        {!props.isPlay ? (
          <>
            {date !== dayjs().format("YYYY-MM-DD").toString() && (
              <>
                <br></br>
                <br></br>
                <br></br>
              </>
            )}
            <Fade in={true}>
              <img src={jordanGif}></img>
            </Fade>
            <Stack
              direction={"column"}
              sx={{ alignItems: "center", justifyContent: "center" }}>
              <Typography variant='h5' padding={1}>
                No games found
              </Typography>

              <Typography variant='body1' color={"text.secondary"} padding={1}>
                {date}
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
