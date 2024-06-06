import * as React from "react";

import AdbIcon from "@mui/icons-material/Adb";
import CrossoverClipsLogo from "../static/logoImg.png";
import wipeLogo from "../static/wipeLogo.gif";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Typography,
  IconButton,
  Toolbar,
  Box,
  AppBar,
  Container,
  Avatar,
  Button,
  Fade,
} from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { changeDateSelected } from "../pages/date/dateSlice";
import {
  fetchDaysToHighlight,
  fetchGamesByDate,
} from "../services/GameService";

import "./navBar2.css";

const pages = [
  ["teams", "/teams"],
  ["players", "/player/2544"],
  ["date", "/date/" + dayjs().format("YYYY-MM-DD")],
];
const currentDate = dayjs().format("YYYY-MM-DD").toString();

function NavBar2() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = React.useState(CrossoverClipsLogo);
  return (
    <AppBar position='static' elevation={0} sx={{}}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Fade in={true} timeout={600}>
            <IconButton
              className='avatar-button'
              onMouseEnter={() => setLogoSrc(wipeLogo)}
              onMouseLeave={() => setLogoSrc(CrossoverClipsLogo)}
              onClick={() => navigate("/")}>
              <Avatar src={logoSrc} />
            </IconButton>
          </Fade>

          <Box
            sx={{
              justifyContent: "center",
              flexGrow: 1,
              display: "flex",
              mr: { xs: 4, md: 2 },
            }}>
            <Button
              key={"Teams"}
              onClick={() => navigate("/teams")}
              sx={{
                my: 2,
                color: "text.secondary",
                display: "block",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                },
              }}>
              Teams
            </Button>
            <Button
              key={"Players"}
              onClick={() => navigate("/player/2544")}
              sx={{
                color: "text.secondary",
                my: 2,
                display: "block",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                },
              }}>
              Players
            </Button>
            <Button
              key={"Date"}
              onClick={() => {
                dispatch(changeDateSelected(currentDate));
                dispatch(fetchDaysToHighlight(currentDate));
                dispatch(fetchGamesByDate(currentDate));
                navigate("/date/" + currentDate);
              }}
              sx={{
                color: "text.secondary",
                my: 2,
                display: "block",
                "&:hover": {
                  transform: "scale(1.1)",
                  transition: "transform 0.2s",
                },
              }}>
              Date
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar2;
