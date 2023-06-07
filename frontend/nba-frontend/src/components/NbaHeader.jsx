import * as React from "react";
import dayjs from "dayjs";

import Paper from "@mui/material/Paper";

import headerBG from "../static/cc2.gif";
import { Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
function Header(props) {
  const { date } = useParams();
  const navigate = useNavigate();
  // const navigate = useNavigate();

  //console.log(date);

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,

        height: props?.small ? "6vh" : "12vh",
        width: "100%",
        background:
          `url(${headerBG}?` +
          dayjs().format("mm:ss").toString() +
          ") no-repeat",
        // background: gifUrl,
        backgroundSize: props?.small ? "300px 100px" : "600px 200px",
        backgroundPosition: "center",
        // opacity: "70%",

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
      {props.small && (
        // <Link
        //   to={"/byDate/" + date}
        //   state={{
        //     seasons: [],
        //     selectedTeamsLink: [{}, {}],
        //     maxSelectedLink: false,
        //     tabValueLink: 1,
        //     valueLink: date,
        //   }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon fontSize='large' color='info' />
        </IconButton>
        // </Link>
      )}

      {/* <Button sx={{ mx: "45%" }} size='large'>
        {""}
      </Button> */}
    </Paper>
  );
}

export default React.memo(Header);
