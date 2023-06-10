import * as React from "react";
import dayjs from "dayjs";

import Paper from "@mui/material/Paper";

import headerBG from "../static/cc2.gif";
import { Button, Hidden, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate, useParams } from "react-router-dom";
function Header(props) {
  const { date } = useParams();
  const navigate = useNavigate();
  // const navigate = useNavigate();

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
            background:
              `url(${headerBG}?` +
              dayjs().format("mm:ss").toString() +
              ") no-repeat",
            backgroundSize: props?.small ? "300px 100px" : "600px 200px",
            backgroundPosition: "center",
          }}>
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
        </Paper>
      </Hidden>
      <Hidden smUp>
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
            backgroundSize: props?.small ? "300px 100px" : "480px 160px",
            backgroundPosition: props?.small ? "center" : "center right 1px",
          }}>
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
        </Paper>
      </Hidden>
    </>
  );
}

export default React.memo(Header);