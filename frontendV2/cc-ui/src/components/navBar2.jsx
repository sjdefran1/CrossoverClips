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

const pages = ["teams", "players", "date"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
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
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Fade in={true} timeout={600}>
            <Avatar src={CrossoverClipsLogo} />
          </Fade>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='#app-bar-with-responsive-menu'
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}>
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              key={"Teams"}
              onClick={() => navigate("/teams")}
              sx={{ my: 2, color: "white", display: "block" }}>
              Teams
            </Button>
            <Button
              key={"Players"}
              onClick={() => navigate("/player/2544")}
              sx={{ my: 2, color: "white", display: "block" }}>
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
              sx={{ my: 2, color: "white", display: "block" }}>
              Date
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar2;
