import * as React from "react";
import axios from "axios";
import {
  Paper,
  Grid,
  Stack,
  Box,
  Avatar,
  Chip,
  Container,
  TextField,
  Alert,
  Autocomplete,
  Divider,
  IconButton,
  Button,
  Collapse,
  Pagination,
  Fade,
  Hidden,
  LinearProgress,
} from "@mui/material";

import { MyChip, setDictFalse, findTrueKeys } from "./PlayerDashUtil.jsx";

import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

import NbaHeader from "../NbaHeader.jsx";
import NbaFooter from "../NbaFooter";

import { plays, teams } from "./plays.jsx";
import { reqString } from "../../App";

import PlayersPlayList from "../PlaysList/PlayersPlayList.jsx";
import TeamLabel from "../ByTeamDash/TeamLabel.jsx";
import SeasonsSelect from "../ByTeamDash/SeasonsSelect.jsx";

import Filter from "./Filter.jsx";
import FilterSnackBar from "./FilterSnackbar.jsx";
import PlayerSearchBar from "./PlayerSeachBar.jsx";
import VideoFrame from "./VideoFrame.jsx";
import PlayerCard2 from "./PlayerCard2.jsx";
import GamesAvailable from "./GamesAvailable.jsx";
import GameShowingDash from "./GameShowingDash.jsx";

export default function PlayerDash(props) {
  // season filter
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);
  //
  // const [playArr, setPlayArr] = React.useState(plays);
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [filtersShowing, setFiltersShowing] = React.useState(true);
  const [bigVideoEnabled, setBigVideoEnabled] = React.useState(false);
  // pagination
  const [playArrowIndex, setPlayArrowIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [currentShowingPlays, setCurrentShowingPlays] = React.useState();

  // loading status
  const [requestLoading, setRequestLoading] = React.useState(true);
  const [gidRequestLoading, setGidRequestLoading] = React.useState(false);
  // new implementation

  const [pagePlayDict, setPagePlayDict] = React.useState({});
  const [lenPlaysAvailable, setLenPlaysAvailable] = React.useState(0);

  // games available dash
  const [gamesAvailableShowing, setGamesAvailableShowing] =
    React.useState(false);

  const [gamesAvailable, setGamesAvailable] = React.useState([]);
  const [gameShowing, setGameShowing] = React.useState([]);
  const [gamesAvailableDictionary, setGamesAvailableDictionary] =
    React.useState({});
  // Filter stuff
  const [currentPlayer, setCurrentPlayer] = React.useState({
    playerID: 2544,
    fname: "LeBron",
    lname: "James",
    yrsplayed: 20,
    jerseynum: 6.0,
    pos: "Forward",
    status: "Active",
    teamID: 1610612747,
    goatflag: "Y",
  });

  const [quarterDict, setQuarterDict] = React.useState({
    1: false,
    2: false,
    3: false,
    4: false,
    OT: false,
  });

  const [statDict, setStatDict] = React.useState({
    FGM: false,
    BLK: false,
    STL: false,
    AST: false,
    DUNK: false,
  });

  const [homeAwayDict, setHomeAwayDict] = React.useState({
    Home: false,
    Away: false,
  });

  const [seasonTypeDict, setSeasonTypeDict] = React.useState({
    Regular: false,
    Playoffs: false,
  });

  const [teamsPlayerOn, setTeamsPlayerOn] = React.useState([]);
  const [matchups, setMatchups] = React.useState([]);

  const clearFilters = () => {
    let clearedQuarters = setDictFalse(quarterDict);
    let clearedSeasonType = setDictFalse(seasonTypeDict);
    let clearedStatType = setDictFalse(statDict);
    let clearedHomeAway = setDictFalse(homeAwayDict);

    setQuarterDict(clearedQuarters);
    setSeasonTypeDict(clearedSeasonType);
    setStatDict(clearedStatType);
    setHomeAwayDict(clearedHomeAway);
    setSeasonsSelected([]);
  };

  const clearFiltersAndGetSamplePlays = async (newPlayer) => {
    setCurrentPlayer(newPlayer);
    clearFilters();
  };

  const createSearchResults = () => {
    let quarterOptions = findTrueKeys(quarterDict);
    let seasonTypeOptions = findTrueKeys(seasonTypeDict);
    let statTypeOptions = findTrueKeys(statDict);
    let homeAwayOptions = findTrueKeys(homeAwayDict);

    // i prefer the boxs unchecked on load
    // but if none are selected we have an empty arr != length of keys
    // but we want to return null in this situation
    let seasonsOptions = [...seasonsSelected];
    if (seasonsSelected.length === 0) {
      seasonsOptions = null;
    }

    // convert regular and playoffs to corresponding ints in db
    if (seasonTypeOptions !== null) {
      if (seasonTypeOptions[0] === "Regular") {
        seasonTypeOptions = [0];
      } else {
        seasonTypeOptions = [1];
      }
    }

    let requestOptions = {
      player_id: currentPlayer.playerID,
      team_id: teamsPlayerOn.length === 0 ? null : teamsPlayerOn,
      matchup_team_id: matchups === 0 ? null : matchups,
      limit: 1000,
      quarter: quarterOptions, // needs to accept arr in backend
      stat_type: statTypeOptions, // needs to accept arr in backend
      gid: null,
      gtype: seasonTypeOptions,
      season: seasonsOptions,
      home_away: homeAwayOptions,
    };
    // console.log(requestOptions);
    // submit request
    submitFilteredSearchAxios(requestOptions);
  };

  const submitFilteredSearchAxios = (options) => {
    setRequestLoading(true);
    axios
      .post(reqString + "players/plays2", options)
      .then((response) => {
        let sortedList = Object.entries(response.data.games_available).sort(
          function (a, b) {
            return b[1].playerpts - a[1].playerpts;
          }
        );
        // console.log(sortedList);
        setPagePlayDict(response.data.results);
        setPageCount(response.data.page_count);
        setGamesAvailable(sortedList);
        setGamesAvailableDictionary(response.data.games_available);

        // first page[1], first play[0], game id
        let firstGameInResultsGID = response.data.results[1][0].gid;
        // find games_available dict for this id to display pts and score
        setGameShowing([
          firstGameInResultsGID,
          response.data.games_available[firstGameInResultsGID],
        ]);

        setPage(1);
        setLenPlaysAvailable(response.data.len);

        if (response.data.len > 0) {
          // first page of results
          let newDict = {
            plays: response.data.results[1],
          };

          setCurrentShowingPlays(newDict);
          setCurrentUrl(newDict.plays[0].url);
        }
      })
      .finally(() => {
        setRequestLoading(false);
        setFiltersShowing(false);
        setGamesAvailableShowing(true);

        // console.log(gameShowing);
      });
  };

  const getSamplePlaysAxios = (pid) => {
    setRequestLoading(true);
    let player = {
      pid: pid,
    };
    axios
      .post(reqString + "players/samplePlays2", player)
      .then((response) => {
        setPagePlayDict(response.data.results);
        setPageCount(response.data.page_count);
        setPage(1);
        setLenPlaysAvailable(response.data.len);

        if (response.data.len > 0) {
          let newDict = {
            plays: response.data.results[1],
          };

          setCurrentShowingPlays(newDict);
          setCurrentUrl(newDict.plays[0].url);
        }
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };

  const getPlaysByGameID = (gid) => {
    let statTypeOptions = findTrueKeys(statDict);
    let quarterOptions = findTrueKeys(quarterDict);
    setGidRequestLoading(true);

    // crete custom request for specific game
    // still includes in game options but gets rid of rest to ensure
    // game is found in query
    let requestOptions = {
      player_id: currentPlayer.playerID,
      team_id: null,
      matchup_team_id: null,
      limit: 1000,
      quarter: quarterOptions, // needs to accept arr in backend
      stat_type: statTypeOptions, // needs to accept arr in backend
      gid: gid,
      gtype: null,
      season: null,
      home_away: null,
    };

    axios
      .post(reqString + "players/plays2", requestOptions)
      .then((response) => {
        // console.log(sortedList);
        setPagePlayDict(response.data.results);
        setPageCount(response.data.page_count);

        // first page[1], first play[0], game id
        let firstGameInResultsGID = response.data.results[1][0].gid;
        // find games_available dict for this id to display pts and score
        setGameShowing([
          firstGameInResultsGID,
          response.data.games_available[firstGameInResultsGID],
        ]);

        setPage(1);
        setLenPlaysAvailable(response.data.len);

        // update play list if we have results
        if (response.data.len > 0) {
          let newDict = {
            plays: response.data.results[1],
          };

          setCurrentShowingPlays(newDict);
          setCurrentUrl(newDict.plays[0].url);
        }
      })
      .finally(() => {
        setGidRequestLoading(false);
        setGamesAvailableShowing(true);
      });
  };

  /**
   * Play Pagination func's
   */

  const handlePageChange = (event, value) => {
    setPage(value);
    // console.log(value);
    // page 2
    // 2 * 5 = 10 - 5 = 5 as start of second page ??
    setPlayArrowIndex(0);
    let newDict = {
      plays: pagePlayDict[value],
    };
    console.log("new dict");
    console.log(newDict);
    setCurrentShowingPlays(newDict);
    setCurrentUrl(newDict.plays[0].url);

    // setCurrentShowingPlays(pagePlayDict[value]);
    // set current showing plays to page_dict[newPage]
  };

  const setPlayArrowIndexFunc = (val) => {
    // either + 1 or - 1
    let newIndex = playArrowIndex + val;

    // need to move onto next page
    if (newIndex > 4) {
      console.log("New Page to Load " + (page + 1));
      // if the new page to load exists
      if (page + 1 <= pageCount) {
        // reset index for new page
        setPlayArrowIndex(0);
        // passing in null as "event", then next page
        handlePageChange(null, page + 1);
      }
      // need to move back a page
      // same process as above
    } else if (newIndex < 0) {
      console.log("New Page to Load " + (page - 1));
      if (page - 1 > 0) {
        setPlayArrowIndex(0);
        handlePageChange(null, page - 1);
      }
    } else {
      // still in same page update index
      // console.log("NewIndex " + newIndex);
      setPlayArrowIndex(newIndex);
      // setCurrentUrl(currentShowingPlays.plays[0].url);
      // console.log(currentShowingPlays.plays[0].url);
    }
  };

  /**
   * Use Effect Functions
   */

  // when page is first loaded get sample plays
  // atm it gets them for lebron to avoid white screens
  React.useState(() => {
    getSamplePlaysAxios(currentPlayer.playerID);
  }, []);

  // when a new player is selected from autocomplete
  // get new sample plays
  // retrieves top 20 highlights by view
  React.useEffect(() => {
    setGamesAvailableShowing(false);
    setFiltersShowing(true);
    setGamesAvailable([]);
    getSamplePlaysAxios(currentPlayer.playerID);
    setPlayArrowIndex(0);
  }, [currentPlayer]);

  React.useEffect(() => {
    // update the url to change video in iframe
    setCurrentUrl(currentShowingPlays?.plays[playArrowIndex].url);

    // when a new play comes, we need to see if its the same game
    // as we were previously watching, if it isn't we need to update
    // the currentShowingGame for the game select dash
    // we pass in a list to perserve the gid, for later requests
    let showingGameID = currentShowingPlays?.plays[playArrowIndex].gid;
    if (showingGameID !== gameShowing[1]?.gid) {
      setGameShowing([showingGameID, gamesAvailableDictionary[showingGameID]]);
    }
  }, [playArrowIndex]);

  // console.log(gamesAvailable);
  return (
    <>
      <Collapse in={!bigVideoEnabled}>
        <Paper sx={{}}>
          <NbaHeader small={true} />
        </Paper>
      </Collapse>
      <Container maxWidth={"xl"}>
        <Collapse in={!bigVideoEnabled}>
          <Box ml={"5%"}>
            <PlayerSearchBar
              setCurrentPlayer={setCurrentPlayer}
              clearFiltersAndGetSamplePlays={clearFiltersAndGetSamplePlays}
            />
          </Box>
        </Collapse>

        {/* Main */}

        <Grid container>
          {bigVideoEnabled && !requestLoading && (
            <Grid item xs={12}>
              <VideoFrame
                playArr={currentShowingPlays}
                currentUrl={currentUrl}
                setPlayArr={setCurrentShowingPlays}
                setCurrentUrl={setCurrentUrl}
                bigVideoEnabled={bigVideoEnabled}
                setBigVideoEnabled={setBigVideoEnabled}
                setPlayArrowIndexFunc={setPlayArrowIndexFunc}
                playArrowIndex={playArrowIndex}
              />
            </Grid>
          )}

          {/* Player Dash, logo name etc */}
          <Grid item xs={12} md={5.5} sx={{ my: 1 }}>
            {/* Game Showing above playercard when fullscreen */}
            {/* If user enters new search we need to temp remove these */}
            {gamesAvailableShowing && bigVideoEnabled && !requestLoading && (
              <Fade in={true} timeout={500}>
                <div>
                  <Hidden smDown>
                    <GameShowingDash
                      gameShowing={gameShowing}
                      currentPlayer={currentPlayer}
                    />

                    <GamesAvailable
                      gamesAvailable={gamesAvailable}
                      getPlaysByGameID={getPlaysByGameID}
                      gidRequestLoading={gidRequestLoading}
                      currentPlayer={currentPlayer}
                      currentShowingPlay={currentShowingPlays[playArrowIndex]}
                      gameShowing={gameShowing}
                      setGameShowing={setGameShowing}
                    />
                  </Hidden>
                </div>
              </Fade>
            )}

            <PlayerCard2
              bigVideoEnabled={bigVideoEnabled}
              currentPlayer={currentPlayer}
            />

            {/* Games Available below when fullscreenoff */}
            {/* If user enters new search we need to temp remove these */}
            {gamesAvailableShowing && !bigVideoEnabled && !requestLoading && (
              <Fade in={true} timeout={500}>
                <div>
                  <Hidden smDown>
                    <GameShowingDash
                      gameShowing={gameShowing}
                      currentPlayer={currentPlayer}
                    />

                    <GamesAvailable
                      gamesAvailable={gamesAvailable}
                      getPlaysByGameID={getPlaysByGameID}
                      currentPlayer={currentPlayer}
                      gidRequestLoading={gidRequestLoading}
                      currentShowingPlay={currentShowingPlays[playArrowIndex]}
                      gameShowing={gameShowing}
                      setGameShowing={setGameShowing}
                    />
                  </Hidden>
                </div>
              </Fade>
            )}

            {/* Mobile view of Filter info */}
            <Hidden smUp>
              <Alert
                severity='info'
                sx={{ justifyContent: "center", textAlign: "center" }}>
                All results are returned by default
              </Alert>
            </Hidden>

            {/* Top Of filters buttons/header */}
            <FilterSnackBar
              filtersShowing={filtersShowing}
              setFiltersShowing={setFiltersShowing}
              clearFilters={clearFilters}
              createSearchResults={createSearchResults}
            />

            {/* When Search is made filters collapse
            can also be triggered by expand/collapse filters button */}
            <Collapse in={filtersShowing}>
              {/* Find plays against matchup autocomplete */}
              {/* See second autocomplete for comments */}
              <Autocomplete
                multiple
                autoHighlight
                clearOnEscape
                autoComplete={true}
                id='combo-box-demo'
                options={teams}
                getOptionLabel={(option) => option?.full_name}
                sx={{ width: "95%", padding: 1 }}
                size='small'
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option) => (
                    <MyChip label={option.full_name} id={option.id} />
                  ));
                }}
                onChange={(event, newValue) => {
                  try {
                    let newId = newValue[newValue.length - 1].id;
                    setMatchups((prevState) => [...prevState, newId]);
                  } catch (error) {
                    setMatchups([]);
                  }
                }}
                renderOption={(props, option) => (
                  <Box component='li' {...props} key={option.id}>
                    <TeamLabel team_id={option?.id} name={option?.full_name} />
                  </Box>
                )}
                renderInput={(params) => (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <SearchIcon />
                    <TextField
                      {...params}
                      label='Find plays against these teams'
                    />
                  </Stack>
                )}
              />

              {/* Find plays while player was on this team
                auto complete */}
              <Autocomplete
                multiple
                autoHighlight
                clearOnEscape
                autoComplete={true}
                id='combo-box-demo'
                options={teams}
                getOptionLabel={(option) => option?.full_name}
                sx={{ width: "95%", padding: 1 }}
                size='small'
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option) => (
                    <MyChip label={option.full_name} id={option.id} />
                  ));
                }}
                onChange={(event, newValue) => {
                  try {
                    let newId = newValue[newValue.length - 1].id; // new team being added id
                    setTeamsPlayerOn((prevState) => [...prevState, newId]); // add new val to end of array
                  } catch (error) {
                    // when deleting last elment for autocomplete it throws error
                    setTeamsPlayerOn([]);
                  }
                }}
                renderOption={(props, option) => (
                  // Items for dropdown of autocomplete (team logo and name)
                  <Box component='li' {...props} key={option.id}>
                    <TeamLabel team_id={option?.id} name={option?.full_name} />
                  </Box>
                )}
                renderInput={(params) => (
                  // what the search bar looks like
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <SearchIcon />
                    <TextField
                      {...params}
                      label='Find plays when player was on these teams'
                    />
                  </Stack>
                )}
              />

              {/* Filters Start */}
              <Hidden smDown>
                <Alert
                  severity='info'
                  sx={{ justifyContent: "center", textAlign: "center" }}>
                  All results are returned by default. Choosing a filter type
                  (e.g. szn) will only filter that type down, others will remain
                  uneffected
                </Alert>
              </Hidden>

              {/* Seasons select */}
              <Paper sx={{ mt: 1 }}>
                <Paper
                  variant='outlined'
                  sx={{ textAlign: "center", bgcolor: "#333" }}>
                  <Chip
                    variant='outlined'
                    label='Choose Seasons'
                    sx={{ my: 0.5 }}
                  />
                </Paper>

                <Box padding={1} textAlign={"center"}>
                  <SeasonsSelect
                    showAlert={false}
                    seasonsSelected={seasonsSelected}
                    setSeasonsSelected={setSeasonsSelected}
                  />
                </Box>
              </Paper>

              {/* Filter By GameType */}
              <Box my={1} textAlign={"center"}>
                <Divider />
                <Chip
                  label='Game Type'
                  variant='outlined'
                  sx={{ my: 1 }}
                  color='info'
                />
                <Divider />
              </Box>

              {/* Rest of filters */}

              {/* home/away, regular/playoffs, */}
              <Grid container>
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(homeAwayDict)}
                    dict={homeAwayDict}
                    setDict={setHomeAwayDict}
                    title={"Court"}
                  />
                </Grid>
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(seasonTypeDict)}
                    dict={seasonTypeDict}
                    setDict={setSeasonTypeDict}
                    title={"Season Type"}
                  />
                </Grid>
              </Grid>

              {/* In Game Options */}
              <Box my={1} textAlign={"center"}>
                <Divider />
                <Chip
                  label='In Game Options'
                  variant='outlined'
                  sx={{ my: 1 }}
                  color='info'
                />
                <Divider />
              </Box>

              {/* Filters that use Filter Component */}
              <Grid container>
                {/* FGM, BLK etc (statType) */}
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(statDict)}
                    dict={statDict}
                    setDict={setStatDict}
                    title={"Stat Type"}
                  />
                </Grid>

                {/* Quarters 1,2,3,4,OT */}
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(quarterDict)}
                    dict={quarterDict}
                    setDict={setQuarterDict}
                    title={"Quarter"}
                  />
                </Grid>
              </Grid>

              {/* Submit and clear button */}
              <Stack
                direction='row'
                sx={{ textAlign: "center", justifyContent: "center" }}>
                <Button
                  variant='contained'
                  color='success'
                  size='large'
                  // disabled={!selectedTeams[0]?.id || !seasonsSelected.length > 0} // only avaialbe when a team has been clicked
                  onClick={() => createSearchResults()}
                  sx={{ my: 1 }}>
                  Submit
                </Button>

                <IconButton onClick={() => clearFilters()}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Collapse>

            <Hidden smUp>
              {gamesAvailableShowing && !requestLoading && (
                <GameShowingDash
                  gameShowing={gameShowing}
                  currentPlayer={currentPlayer}
                />
              )}
            </Hidden>

            {/* Final Grid tag of left side of page */}
          </Grid>

          {/* Video preview
              Plays List */}
          <Grid item xs={12} md={6} ml={1} mt={1}>
            {!bigVideoEnabled && (
              <VideoFrame
                playArr={currentShowingPlays}
                currentUrl={currentUrl}
                setPlayArr={setCurrentShowingPlays}
                setCurrentUrl={setCurrentUrl}
                bigVideoEnabled={bigVideoEnabled}
                setBigVideoEnabled={setBigVideoEnabled}
                setPlayArrowIndexFunc={setPlayArrowIndexFunc}
                playArrowIndex={playArrowIndex}
              />
            )}

            <Hidden smUp>
              {gamesAvailableShowing && !requestLoading && (
                <GamesAvailable
                  gamesAvailable={gamesAvailable}
                  getPlaysByGameID={getPlaysByGameID}
                  currentPlayer={currentPlayer}
                  gidRequestLoading={gidRequestLoading}
                  currentShowingPlay={currentShowingPlays[playArrowIndex]}
                  gameShowing={gameShowing}
                  setGameShowing={setGameShowing}
                />
              )}
            </Hidden>

            {requestLoading && <LinearProgress color='success' />}
            {!requestLoading && (
              <PlayersPlayList
                playByPlay={currentShowingPlays}
                playInVideoPlayer={currentShowingPlays?.plays[playArrowIndex]}
                playIndex={playArrowIndex}
                setPlayArrowIndex={setPlayArrowIndex}
              />
            )}

            {/* if we have more than 5 plays, use paginationi */}
            {pageCount > 0 && !requestLoading && (
              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Pagination
                  sx={{ width: "100%" }}
                  page={page}
                  count={pageCount}
                  onChange={handlePageChange}
                />
              </Box>
            )}
          </Grid>

          {/* end of whole grid */}
        </Grid>
      </Container>

      <NbaFooter />
    </>
  );
}
