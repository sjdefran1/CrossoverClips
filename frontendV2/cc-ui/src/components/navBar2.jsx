import * as React from "react";

import AdbIcon from "@mui/icons-material/Adb";
import CrossoverClipsLogo from "../static/logoImg.png";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Typography,
  IconButton,
  Toolbar,
  Box,
  AppBar,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
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
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const dispatch = useDispatch();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  return (
    <AppBar position='static' elevation={0} sx={{}}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Fade in={true} timeout={600}>
            <IconButton className='avatar-button' onClick={() => navigate("/")}>
              <Avatar src={CrossoverClipsLogo} />
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

          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar2;
