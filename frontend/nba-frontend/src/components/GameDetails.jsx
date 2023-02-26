import * as React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListItemButton,
  Link,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import GameDash from "./GameDash";

export default function GameDetails(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [playByPlay, setPlayByPlay] = React.useState([]);
  const [currentQuarter, setCurrentQuarter] = React.useState(1);
  const [playsIsLoading, setPlaysIsLoading] = React.useState(true);

  const getPlaysAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      gameID: e.toString(),
      date: date,
    };
    axios
      .post("http://localhost:8000/playByPlay", data)
      .then((response) => {
        console.log(response.data);
        setPlayByPlay(response.data);
        //const data = JSON.parse(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPlaysIsLoading(false); // Set isLoading back to false once the response is received
      });
  };

  const handleQuarterChangeLeft = (val) => {
    if (currentQuarter === 1) {
      return;
    }
    setCurrentQuarter(currentQuarter - 1);
  };

  const handleQuarterChangeRight = (val) => {
    if (currentQuarter === 4) {
      return;
    }
    setCurrentQuarter(currentQuarter + 1);
  };

  React.useEffect(() => {
    getPlaysAxios(id);
    // getGameInfoAxios(id);
    console.log("useeffect");
  }, []);

  return (
    <>
      {/* GameInfo */}
      {/* ------------------------------------------------ */}
      <br></br>
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <GameDash />
          </Grid>
          {/* ------------------------------------------------ */}
          {/* PlayByPlay */}
          {/* ---------------------------------------------- */}
          <Grid item xs={6}>
            <AppBar position='static' sx={{ borderRadius: 1 }}>
              <Toolbar sx={{ justifyContent: "center" }}>
                <IconButton onClick={handleQuarterChangeLeft}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant='h5' color='text.secondary'>
                  Quarter: {currentQuarter}
                </Typography>
                <IconButton onClick={handleQuarterChangeRight}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Stack spacing={1} sx={{ maxHeight: "80vh", overflow: "auto" }}>
              {/* Loading */}
              {playsIsLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <CircularProgress />
                </Stack>
              )}

              {/* Request Recieved, Map plays to list */}
              {!playsIsLoading &&
                playByPlay
                  .filter((play) => play.quarter === currentQuarter)
                  .map((play) => (
                    <>
                      <nav aria-label='playbyplay'>
                        <Link
                          target='_blank'
                          rel='noreferrer'
                          href={play.url}
                          sx={{ textDecoration: "none" }}>
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon>
                                  <Avatar
                                    src={
                                      "https://cdn.nba.com/logos/nba/" +
                                      play.teamID +
                                      "/primary/L/logo.svg"
                                    }
                                    sx={{ width: 56, height: 56 }}
                                  />
                                </ListItemIcon>

                                <ListItemText
                                  primary={play.description}
                                  secondary={
                                    "Home " +
                                    play.scoreHome +
                                    "-" +
                                    play.scoreAway +
                                    " Away"
                                  }
                                  sx={{ textAlign: "center" }}
                                />

                                <ListItemIcon>
                                  <Avatar
                                    src={
                                      "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                                      play.playerID +
                                      ".png"
                                    }
                                    sx={{ width: 56, height: 56 }}
                                  />
                                </ListItemIcon>
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Link>
                      </nav>
                      <Divider />
                    </>
                  ))}
            </Stack>
          </Grid>
          {/* ------------------------------------- */}
        </Grid>
      </Container>
    </>
  );
}
