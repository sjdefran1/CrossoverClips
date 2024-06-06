import * as React from "react";
import Paper from "@mui/material/Paper";

import headerBG from "../static/cc2.gif";
import { Hidden, IconButton, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
export default function NavBar(props) {
  const navigate = useNavigate();
  const [hideBackArrow, setHideBackArrow] = React.useState(false);

  //console.log(date);

  return (
    <>
      <Hidden smDown>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,

            height: props?.small ? "6vh" : "12vh",
            width: "100%",
            background: `url(${headerBG}?` + ") no-repeat",
            backgroundSize: props?.small ? "300px 100px" : "600px 200px",
            backgroundPosition: "center",
          }}>
          {props.small && (
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ display: hideBackArrow ? "none" : "" }}>
                <ArrowBackIcon fontSize='large' color='info' />
              </IconButton>

              <IconButton
                onClick={() => navigate("/home")}
                sx={{ mt: hideBackArrow ? 1 : 0 }} // arrow is off centered when back arrow isnt laoded
              >
                <HomeIcon color='action' />
              </IconButton>
            </Stack>
            // </Link>
          )}
        </Paper>
      </Hidden>
      <Hidden smUp>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,

            height: props?.small ? "6vh" : "12vh",
            width: "100%",
            background: `url(${headerBG}?` + ") no-repeat",
            backgroundSize: props?.small ? "300px 100px" : "480px 160px",
            backgroundPosition: props?.small ? "center" : "center right 1px",
          }}>
          {props.small && (
            <Stack direction={"row"} alignItems={"center"}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{ display: hideBackArrow ? "none" : "" }}>
                <ArrowBackIcon fontSize='large' color='info' />
              </IconButton>

              <IconButton
                onClick={() => navigate("/home")}
                sx={{ mt: hideBackArrow ? 1 : 0 }} // arrow is off centered when back arrow isnt laoded
              >
                <HomeIcon color='action' />
              </IconButton>
            </Stack>
          )}
        </Paper>
      </Hidden>
    </>
  );
}
