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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import GameDash from "./GameDash";
import PlayerFilter from "./PlayerFilter";
import NoHighlights from "./PlaysList/NoHighlights";
import PlayList from "./PlaysList/PlayList.jsx";
import { useLocation } from "react-router-dom";
import FilteredPlayList from "./PlaysList/FilteredPlayList";
import StatFilter from "./StatFilters";
import GameStatsDash from "./GameStatsDash";

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
    [currentQuarter, playByPlay.number_quarters]
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
    //getPlaysAxios(id), 1000);
  };

  React.useEffect(() => {
    getPlaysAxios(id);
    // eslint-disable-next-line
  }, [statFilterFrom]);

  // React.useEffect(() => {
  //   setTabValue(playByPlay?.players?.length > 0 ? 0 : 1);
  // }, [playByPlay]);

  return (
    <>
      {/* GameInfo */}
      {/* ------------------------------------------------ */}
      <Container maxWidth='xl'>
        <Grid container spacing={2} paddingTop>
          <Grid item xs={12} md={6}>
            {/* GAMEDASH AND PLAYER FILTER */}
            <Fade in={true} timeout={800}>
              <div>
                <GameDash game_link={state.game_link} />
              </div>
            </Fade>
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
            {tabValue == 1 && (
              <>
                <Fade in={true} timeout={800}>
                  <div>
                    <GameStatsDash gameInfo={state.game_link} />
                  </div>
                </Fade>
              </>
            )}

            <Grid container>
              {playsIsLoading && (
                <Grid item xs={12} md={8}>
                  <Stack sx={{ justifyContent: "center" }}>
                    <br></br>
                    <CircularProgress sx={{ ml: "50%" }} />
                  </Stack>
                </Grid>
              )}
              <Hidden mdDown>
                {/* if players array is empty -> retro game -> don't load player filters */}
                {!playsIsLoading &&
                  playByPlay.players.length > 0 &&
                  tabValue === 0 && (
                    <>
                      <Grid item xs={12} md={8}>
                        <PlayerFilter
                          players={playByPlay.players}
                          teamIDs={playByPlay.team_ids}
                          currentFilterPlayers={filteredPlayers}
                          setPlayerFilter={getFilteredPlayers}
                          getStatFilter={getStatFilter}
                        />
                      </Grid>
                    </>
                  )}

                {tabValue === 0 && (
                  <Grid item xs={12} md={4}>
                    <StatFilter updateFilter={getStatFilter} />
                  </Grid>
                )}
              </Hidden>

              {/* Mobile filters view */}
              <Hidden mdUp>
                <Accordion disableGutters>
                  <AccordionSummary>Player Filters</AccordionSummary>
                  <AccordionDetails>
                    <PlayerFilter
                      players={playByPlay.players}
                      teamIDs={playByPlay.team_ids}
                      currentFilterPlayers={filteredPlayers}
                      setPlayerFilter={getFilteredPlayers}
                      getStatFilter={getStatFilter}
                    />
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ minWidth: "100%" }} disableGutters>
                  <AccordionSummary>Stat Filters</AccordionSummary>
                  <AccordionDetails>
                    <StatFilter updateFilter={getStatFilter} />
                  </AccordionDetails>
                </Accordion>
              </Hidden>
            </Grid>
          </Grid>
          {/* ------------------------------------------------ */}
          {/* PlayByPlay */}
          {/* ---------------------------------------------- */}
          <Grid item xs={12} md={6}>
            <AppBar position='static' sx={{ borderRadius: 1 }}>
              <Toolbar sx={{ justifyContent: "right" }}>
                <Stack direction='row' alignItems={"center"} sx={{ mr: "12%" }}>
                  <IconButton onClick={() => handleQuarterChange(0)}>
                    <KeyboardArrowLeftIcon color='info' />
                  </IconButton>
                  <Typography variant='body1' color='text.secondary'>
                    Quarter: {currentQuarter}
                  </Typography>

                  <IconButton onClick={() => handleQuarterChange(1)}>
                    <KeyboardArrowRightIcon color='info' />
                  </IconButton>
                </Stack>

                <FormGroup>
                  <FormControlLabel
                    sx={{ mr: 1 }}
                    disabled
                    control={<Switch size='small' />}
                    onChange={handleSwitchChange}
                    label={
                      <Typography color={"text.secondary"} variant='subtitle2'>
                        Highlight Previews
                      </Typography>
                    }
                  />
                </FormGroup>
                <Tooltip title='Highlight previews generally load slower than just clicking the play! But feel free to try them.'>
                  <InfoIcon color='success' />
                </Tooltip>
              </Toolbar>
            </AppBar>
            <Stack
              sx={{
                maxHeight: "78vh",
                overflow: "auto",
              }}>
              {/* Loading */}
              {playsIsLoading && (
                <Stack sx={{ justifyContent: "center" }}>
                  <br></br>
                  <CircularProgress sx={{ ml: "50%" }} />
                </Stack>
              )}

              {/* Finished Game No Highlights from VideoDetail Yet */}
              {!playsIsLoading && playByPlay.plays.length === 0 && (
                <NoHighlights isPlay={false} />
              )}

              {/* Request Recieved, Render PlayList Copmonent */}

              {!playsIsLoading && !isFilteredPlayers && (
                <PlayList
                  playByPlay={playByPlay}
                  currentQuarter={currentQuarter}
                />
              )}
              {/* Player Filters have been applied */}
              {!playsIsLoading && isFilteredPlayers && (
                <FilteredPlayList
                  playByPlay={playByPlay}
                  filteredPlayers={filteredPlayers}
                  currentQuarter={currentQuarter}
                  currentStatType={statFilterFrom}
                />
              )}
            </Stack>
          </Grid>
          {/* ------------------------------------- */}
        </Grid>
      </Container>
    </>
  );
}
