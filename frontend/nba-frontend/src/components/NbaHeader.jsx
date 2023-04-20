import * as React from "react";
import dayjs from "dayjs";

import Paper from "@mui/material/Paper";

import headerBG from "../static/header.gif";

function Header(props) {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,

        height: "15vh",
        width: "100%",
        background:
          `url(${headerBG}?` +
          dayjs().format("mm:ss").toString() +
          ") no-repeat",
        // background: gifUrl,
        backgroundSize: "600px 200px",
        backgroundPosition: "center",

        // background:
        //   "linear-gradient(45deg, hsla(212, 38%, 35%, 1) 19%, hsla(1, 67%, 29%, 1) 100%)",
        // backgroundSize: "200% 200%",
        // animation: `${gradient} 7s infinite ease alternate`,
      }}>
      {/* <Paper
    sx={{
      mx: "auto",
      opacity: "10%",
    }}> */}
      {/* <Stack
    direction={"row"}
    sx={{
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      borderRadius: 2,

      // background:
      //   "linear-gradient(to right, hsla(0, 0%, 14%, 1) 19%, hsla(0, 1%, 28%, 1) 100%)",
      // backgroundSize: "200% 200%",
      // animation: `${gradient} 10s infinite ease alternate`,
    }}>
    <Typography
      variant='h4'
      color={"text.secondary"}
      fontFamily={`"Helvetica", sans-serif`}>
      NBA Clip Finder
    </Typography>

    <Hidden mdDown>
      <Avatar src={trophyGif} sx={{ width: 100, height: 100 }} />
    </Hidden>
  </Stack> */}
      {/* </Paper> */}
    </Paper>
  );
}

export default React.memo(Header);
