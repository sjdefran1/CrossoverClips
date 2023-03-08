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
import PlaySecondary from "./PlaySecondary";
import { useLocation } from "react-router-dom";

export default function GameDetails(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [playByPlay, setPlayByPlay] = React.useState({});
  const [currentQuarter, setCurrentQuarter] = React.useState(1);
  const [playsIsLoading, setPlaysIsLoading] = React.useState(true);
  const [filteredPlayers, setFilteredPlayers] = React.useState([]);
  const [isFilteredPlayers, setIsFilteredPlayers] = React.useState(false);
  const [statFilterFrom, setStatFilterFrom] = React.useState("FGM");
  let { state } = useLocation();

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
      if (currentQuarter === playByPlay.number_quarters && val === 1) {
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
    // dont need to make request if only players changed, not stat filter
    if (stat === statFilterFrom) {
      return;
    }
    setStatFilterFrom(stat);
    setTimeout(getPlaysAxios(id), 1000);
  };

  React.useEffect(() => {
    getPlaysAxios(id);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* GameInfo */}
      {/* ------------------------------------------------ */}
      <Container maxWidth='lg'>
        <Grid container spacing={2} paddingTop>
          <Grid item xs={6}>
            {/* {state.game_link.date} */}
            <GameDash game_link={state.game_link} />
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
                <Typography variant='body1' color='text.secondary'>
                  Quarter: {currentQuarter}
                </Typography>
                <IconButton onClick={() => handleQuarterChange(1)}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Stack sx={{ maxHeight: "75vh", overflow: "auto" }}>
              {/* Loading */}
              {playsIsLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <br></br>
                  <CircularProgress sx={{ ml: "50%" }} />
                </Stack>
              )}

              {/* Request Recieved, Map plays to list */}
              {!playsIsLoading &&
                !isFilteredPlayers &&
                playByPlay.plays
                  .filter((play) => play.quarter === currentQuarter)
                  .map((play) => (
                    <React.Fragment key={play.url}>
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
                                  // secondary={
                                  //   "Home " +
                                  //   play.scoreHome +
                                  //   "-" +
                                  //   play.scoreAway +
                                  //   " Away " +
                                  //   play.time
                                  // }
                                  secondary={
                                    <PlaySecondary
                                      stuff={[
                                        play.scoreHome,
                                        play.scoreAway,
                                        play.time,
                                        playByPlay.team_ids[0],
                                        playByPlay.team_ids[1],
                                      ]}
                                    />
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
                    </React.Fragment>
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
                                    <PlaySecondary
                                      stuff={[
                                        play.scoreHome,
                                        play.scoreAway,
                                        play.time,
                                        playByPlay.team_ids[0],
                                        playByPlay.team_ids[1],
                                      ]}
                                    />
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
