import * as React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Stack,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  Fade,
  FormGroup,
  FormControlLabel,
  Switch,
  Tooltip,
  Box,
  Tabs,
  Tab,
  Tabpanel,
  Hidden,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GameDash from "./GameDash";
import jordanGif from "../../static/jordan.gif";

import PlayerFilter from "./PlayerFilter";
import NoHighlights from "../PlaysList/NoHighlights";
import PlayList from "../PlaysList/PlayList.jsx";
import { useLocation } from "react-router-dom";
import FilteredPlayList from "../PlaysList/FilteredPlayList";
import StatFilter from "./StatFilters";
import GameStatsDash from "./GameStatsDash";
import { reqString } from "../../App.js";
import NbaHeader from "../NbaHeader";
import NbaFooter from "../NbaFooter";

export default function GameDetails(props) {
  const { id } = useParams();
  const { date } = useParams();
  const [playByPlay, setPlayByPlay] = React.useState({});
  const [currentQuarter, setCurrentQuarter] = React.useState(1);
  const [playsIsLoading, setPlaysIsLoading] = React.useState(true);
  const [filteredPlayers, setFilteredPlayers] = React.useState([]);
  const [isFilteredPlayers, setIsFilteredPlayers] = React.useState(false);
  const [statFilterFrom, setStatFilterFrom] = React.useState("FGM");
  const [showHighlightPreview, setShowHighlightPreview] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [replacementGameLink, setReplacementGameLink] = React.useState({});
  const [replacementLoading, setReplacementLoading] = React.useState(true);
  const [errorOnReponse, setErrorOnReponse] = React.useState(false);
  let { state } = useLocation();

  // const [anchorEl, setAnchorEl] = React.useState(null);
  const handleTabChange = (event, newVal) => {
    setTabValue(newVal);
  };

  const handleSwitchChange = (event) => {
    setShowHighlightPreview(!showHighlightPreview);
  };
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const getPlaysAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      gameID: e.toString(),
      date: date,
      statType: statFilterFrom,
    };
    setPlaysIsLoading(true);
    axios
      // .post("http://localhost:8000/playByPlay", data)
      .post(reqString + "playByPlay", data)
      .then((response) => {
        if (response.data === null) {
          setErrorOnReponse(true);
          console.log("fired");
        }
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

  const getGameAxios = (e) => {
    const data = {
      gameID: e.toString(),
    };
    setReplacementLoading(true);
    axios.post(reqString + "getGameByID", data).then((response) => {
      setReplacementGameLink(response.data);
      setReplacementLoading(false);
    });
  };

  const handleQuarterChange = React.useCallback(
    (val) => {
      if (currentQuarter === 1 && val === 0) {
        return;
      }
      if (currentQuarter === playByPlay?.number_quarters && val === 1) {
        return;
      }

      if (val === 1) {
        setCurrentQuarter(currentQuarter + 1);
      }
      if (val === 0) {
        setCurrentQuarter(currentQuarter - 1);
      }
    },
    [currentQuarter, playByPlay?.number_quarters]
  );

  const getFilteredPlayers = (players) => {
    setFilteredPlayers(players);
    setIsFilteredPlayers(true);
    if (players?.length === 0) {
      setIsFilteredPlayers(false);
    }
  };

  const getStatFilter = (stat) => {
    // dont need to make request if only players changed, not stat filter
    if (stat === statFilterFrom) {
      return;
    }
    setStatFilterFrom(stat);
    //getPlaysAxios(id), 1000);
  };

  React.useEffect(() => {
    getPlaysAxios(id);
    // eslint-disable-next-line
  }, [statFilterFrom]);

  React.useEffect(() => {
    if (state === null) {
      getGameAxios(id);
      console.log("use effect");
    } else {
    }

    // eslint-disable-next-line
  }, [state]);

  // React.useEffect(() => {
  //   setTabValue(playByPlay?.players?.length > 0 ? 0 : 1);
  // }, [playByPlay]);
  // console.log(replacementGameLink);
  return (
    <>
      {/* We don't have a game_link (we didn't come from homepage)
          Our call to replace that information hasn't finished
          Once it does render component as normal    
      */}
      {errorOnReponse && (
        <>
          <Paper>
            <NbaHeader />
          </Paper>
          <Container maxWidth='lg'>
            <Paper sx={{ height: "50vh", textAlign: "center" }}>
              <Typography variant='h5' sx={{ mt: 3 }}>
                If your seeing this screen your probably a little early, check
                back soon, sorry!
              </Typography>
              <br></br>
              <img src={jordanGif}></img>
              <Stack direction={"row"} justifyContent={"center"} spacing={1}>
                <InfoIcon color='error' />
                <Typography color={"text.secondary"}>Try Refreshing</Typography>
              </Stack>
            </Paper>
          </Container>
        </>
      )}
      {(!state?.game_link && replacementLoading) || errorOnReponse ? (
        <CircularProgress sx={{ ml: "50%" }} />
      ) : (
        // <p>loaded</p>
        <Container maxWidth='xl' sx={{ mt: 1 }}>
          <Paper>
            <NbaHeader small={true} />
          </Paper>

          <Grid container spacing={2} paddingTop>
            <Grid item xs={12} md={6}>
              {/* GAMEDASH AND PLAYER FILTER */}
              <Fade in={true} timeout={800}>
                <div>
                  {/* Came from game select, have a game_link dict */}
                  {state?.game_link ? (
                    <GameDash game_link={state?.game_link} />
                  ) : (
                    <>
                      {/* Needed replacement, pass that as game_link */}
                      {!replacementLoading && (
                        <GameDash game_link={replacementGameLink} />
                      )}
                    </>
                  )}
                </div>
              </Fade>

              {/* Tab select between, Filters and Game Stats (team comparison) */}
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5 }}>
                  <Tabs
                    centered
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label='Filters or Game Stats'>
                    <Tab label='Filters' tabIndex={0} />
                    <Tab label='Game Stats' tabIndex={1} />
                  </Tabs>
                </Box>
              </Box>

              {/* Game Stats Dashboard */}
              {tabValue === 1 && (
                <>
                  <Fade in={true} timeout={800}>
                    <div>
                      <GameStatsDash
                        gameInfo={
                          state?.game_link
                            ? state?.game_link
                            : replacementGameLink
                        }
                      />
                    </div>
                  </Fade>
                </>
              )}

              {/* Player Filter Dash*/}
              <Grid container>
                {/* Loading Icon */}
                {playsIsLoading && (
                  <Grid item xs={12} md={8}>
                    <Stack sx={{ justifyContent: "center" }}>
                      <br></br>
                      <CircularProgress sx={{ ml: "50%" }} />
                    </Stack>
                  </Grid>
                )}
                {/* Player Filter Web Version
                Hidden on medium down because it is moved to a dropdown on mobile */}
                <Hidden mdDown>
                  {!playsIsLoading &&
                    playByPlay?.players.length > 0 &&
                    tabValue === 0 && (
                      <>
                        <Grid item xs={12} md={8} minHeight={"50vh"}>
                          <PlayerFilter
                            players={playByPlay?.players}
                            teamIDs={playByPlay?.team_ids}
                            currentFilterPlayers={filteredPlayers}
                            setPlayerFilter={getFilteredPlayers}
                            getStatFilter={getStatFilter}
                          />
                        </Grid>
                      </>
                    )}

                  {/* Stat Filter, Choose FGM, BLK, etc */}
                  {tabValue === 0 && (
                    <Grid item xs={12} md={4}>
                      <StatFilter updateFilter={getStatFilter} />
                    </Grid>
                  )}
                </Hidden>

                {/* Mobile filters view */}
                <Hidden mdUp>
                  {!playsIsLoading &&
                    playByPlay?.players.length > 0 &&
                    tabValue === 0 && (
                      <>
                        {/* Accordion for Player and Stat filters */}
                        <Accordion sx={{ minWidth: "100%" }} disableGutters>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            Player Filters
                          </AccordionSummary>
                          <AccordionDetails sx={{ minWidth: "100%" }}>
                            <PlayerFilter
                              players={playByPlay?.players}
                              teamIDs={playByPlay?.team_ids}
                              currentFilterPlayers={filteredPlayers}
                              setPlayerFilter={getFilteredPlayers}
                              getStatFilter={getStatFilter}
                            />
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )}
                  {tabValue === 0 && (
                    <Accordion sx={{ minWidth: "100%" }} disableGutters>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        Stat Filters
                      </AccordionSummary>
                      <AccordionDetails>
                        <StatFilter updateFilter={getStatFilter} />
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Hidden>
              </Grid>
            </Grid>

            {/* ------------------------------------------------ */}
            {/* PlayByPlay */}
            {/* ---------------------------------------------- */}
            <Grid item xs={12} md={6}>
              {/* Controls for playbyplay, switch quarters */}
              <AppBar position='static' sx={{ borderRadius: 1 }}>
                <Toolbar sx={{ justifyContent: "right" }}>
                  <Stack
                    direction='row'
                    alignItems={"center"}
                    sx={{ mr: { xs: "20%", md: "36%" } }}>
                    <IconButton onClick={() => handleQuarterChange(0)}>
                      <KeyboardArrowLeftIcon color='info' />
                    </IconButton>
                    <Typography
                      variant='body1'
                      color='text.secondary'></Typography>
                    <Chip
                      variant='outlined'
                      label={"Quarter: " + currentQuarter}
                      color='info'
                    />
                    <IconButton onClick={() => handleQuarterChange(1)}>
                      <KeyboardArrowRightIcon color='info' />
                    </IconButton>
                  </Stack>
                  <Tooltip title='Click anywhere on a play to be redirected!'>
                    <InfoIcon color='success' />
                  </Tooltip>
                </Toolbar>
              </AppBar>

              {/* Plays are loading in, patience message */}
              {playsIsLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <Alert severity='info'>
                    Please be patient for plays to load
                  </Alert>
                  <br></br>
                  <CircularProgress sx={{ ml: "50%" }} />
                </Stack>
              )}

              <Stack
                sx={{
                  maxHeight: "78vh",
                  overflow: "auto",
                }}>
                {/* Loading */}
                {/* Finished Game No Highlights from VideoDetail Yet */}
                {!playsIsLoading && playByPlay?.plays.length === 0 && (
                  <NoHighlights isPlay={false} />
                )}
                {/* Request Recieved, Render PlayList Copmonent 
                    We have recieved the play by play, and we are not filtering
                    By players 
                */}
                {!playsIsLoading && !isFilteredPlayers && (
                  <PlayList
                    playByPlay={playByPlay}
                    currentQuarter={currentQuarter}
                    currentStatType={statFilterFrom}
                    home_teamID={
                      state?.game_link && replacementLoading
                        ? state?.game_link.home_info.TEAM_ID
                        : replacementGameLink?.home_info.TEAM_ID
                    }
                    away_teamID={
                      state?.game_link && replacementLoading
                        ? state?.game_link.away_info.TEAM_ID
                        : replacementGameLink?.away_info.TEAM_ID
                    }
                  />
                )}
                {/* Player Filters have been applied */}
                {!playsIsLoading && isFilteredPlayers && (
                  <FilteredPlayList
                    playByPlay={playByPlay}
                    filteredPlayers={filteredPlayers}
                    currentQuarter={currentQuarter}
                    currentStatType={statFilterFrom}
                    home_teamID={
                      state?.game_link && replacementLoading
                        ? state?.game_link.home_info.TEAM_ID
                        : replacementGameLink?.home_info.TEAM_ID
                    }
                    away_teamID={
                      state?.game_link && replacementLoading
                        ? state?.game_link.away_info.TEAM_ID
                        : replacementGameLink?.away_info.TEAM_ID
                    }
                  />
                )}
              </Stack>
            </Grid>
            {/* ------------------------------------- */}
          </Grid>
          <Hidden smUp>
            <Alert severity='info'>
              DISCLAIMER - All clips property of the NBA. No copyright
              infringement is intended
            </Alert>
          </Hidden>
          <Hidden smDown>{!playsIsLoading && <NbaFooter />}</Hidden>
        </Container>
      )}
      {/* GameInfo */}
      {/* ------------------------------------------------ */}
    </>
  );
}
