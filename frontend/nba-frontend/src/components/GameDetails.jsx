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
import PlayerFilter from "./PlayerFilter";

export default function GameDetails(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [playByPlay, setPlayByPlay] = React.useState({});
  const [currentQuarter, setCurrentQuarter] = React.useState(1);
  const [playsIsLoading, setPlaysIsLoading] = React.useState(true);
  const [filteredPlayers, setFilteredPlayers] = React.useState([]);
  const [isFilteredPlayers, setIsFilteredPlayers] = React.useState(false);
  const [statFilterFrom, setStatFilterFrom] = React.useState("FGM");

  const getPlaysAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      gameID: e.toString(),
      date: date,
      statType: statFilterFrom,
    };
    axios
      .post("http://localhost:8000/playByPlay", data)
      .then((response) => {
        //console.log(response.data);
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

  const handleQuarterChange = React.useCallback(
    (val) => {
      if (currentQuarter === 1 && val === 0) {
        return;
      }
      if (currentQuarter === 4 && val === 1) {
        return;
      }

      if (val === 1) {
        setCurrentQuarter(currentQuarter + 1);
      }
      if (val === 0) {
        setCurrentQuarter(currentQuarter - 1);
      }
    },
    [currentQuarter]
  );

  const getFilteredPlayers = (players) => {
    setFilteredPlayers(players);
    setIsFilteredPlayers(true);
    if (players.length === 0) {
      setIsFilteredPlayers(false);
    }
  };

  const getStatFilter = (stat) => {
    setStatFilterFrom(stat);
    setTimeout(getPlaysAxios(id), 1000);
  };

  React.useEffect(() => {
    getPlaysAxios(id);
  }, []);

  return (
    <>
      {/* GameInfo */}
      {/* ------------------------------------------------ */}
      <br></br>
      {statFilterFrom}
      <Container maxWidth='lg'>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <GameDash />
            {!playsIsLoading && (
              <>
                <PlayerFilter
                  players={playByPlay.players}
                  teamIDs={playByPlay.team_ids}
                  setPlayerFilter={getFilteredPlayers}
                  getStatFilter={getStatFilter}
                />
              </>
            )}

            {/* {filteredPlayers.map((player) => (
              <>
                <p>{player}</p>
              </>
            ))}
            {isFilteredPlayers && <p>filter</p>} */}
          </Grid>
          {/* ------------------------------------------------ */}
          {/* PlayByPlay */}
          {/* ---------------------------------------------- */}
          <Grid item xs={6}>
            <AppBar position='static' sx={{ borderRadius: 1 }}>
              <Toolbar sx={{ justifyContent: "center" }}>
                <IconButton onClick={() => handleQuarterChange(0)}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <Typography variant='h5' color='text.secondary'>
                  Quarter: {currentQuarter}
                </Typography>
                <IconButton onClick={() => handleQuarterChange(1)}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Stack spacing={1} sx={{ maxHeight: "75vh", overflow: "auto" }}>
              {/* Loading */}
              {playsIsLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <CircularProgress />
                </Stack>
              )}

              {/* Request Recieved, Map plays to list */}
              {!playsIsLoading &&
                !isFilteredPlayers &&
                playByPlay.plays
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
                                    " Away " +
                                    play.time
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

              {!playsIsLoading &&
                isFilteredPlayers &&
                playByPlay.plays
                  .filter(
                    (play) =>
                      play.quarter === currentQuarter &&
                      filteredPlayers.includes(play.playerID)
                  )
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
                                    " Away " +
                                    play.time
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
