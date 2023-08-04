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
} from "@mui/material";

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
import PlayerCard from "./PlayerCard.jsx";
import VideoFrame from "./VideoFrame.jsx";

export default function PlayerDash(props) {
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);
  const [playArr, setPlayArr] = React.useState(plays);
  const [currentUrl, setCurrentUrl] = React.useState(playArr.plays[0]?.url);
  const [filtersShowing, setFiltersShowing] = React.useState(true);
  const [bigVideoEnabled, setBigVideoEnabled] = React.useState(false);
  // pagination
  const [playArrowIndex, setPlayArrowIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [currentShowingPlays, setCurrentShowingPlays] = React.useState();
  const [currentStartIndex, setCurrentStartIndex] = React.useState(0);

  const [requestLoading, setRequestLoading] = React.useState(false);

  /**
   * filters
   *
   *
   * */

  // starts as lebron for now
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

  const setDictFalse = (dict) => {
    let dictCopy = { ...dict };

    for (const key in dictCopy) {
      dictCopy[key] = false;
    }
    return dictCopy;
  };
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

  const findTrueKeys = (dict) => {
    const trueKeys = [];

    for (const key in dict) {
      if (dict[key] === true) {
        trueKeys.push(key);
      }
    }

    // if all filters are selected
    // then that is the same as none being selected on the backend
    // will just not include and clause in sql query
    if (trueKeys.length === Object.keys(dict).length) return null;

    // if no options selected
    // return null to drop and clause
    if (trueKeys.length === 0) return null;

    return trueKeys;
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
    console.log(requestOptions);
    // submit request
    submitFilteredSearchAxios(requestOptions);
  };

  const submitFilteredSearchAxios = (options) => {
    setRequestLoading(true);
    axios
      .post(reqString + "players/plays2", options)
      .then((response) => {
        let newDict = {
          plays: response.data.results,
        };
        console.log(newDict);

        setPlayArr(newDict);
        setCurrentUrl(response.data.results[0].url);
      })
      .finally(() => {
        // playPagination(1);

        setRequestLoading(false);
      });
  };

  const getSamplePlaysAxios = () => {
    setRequestLoading(true);
    let player = {
      pid: currentPlayer.playerID,
    };
    axios
      .post(reqString + "players/samplePlays", player)
      .then((response) => {
        let newDict = {
          plays: response.data.results,
        };
        console.log(newDict);
        setPlayArr(newDict);
        setCurrentUrl(response.data.results[0].url);
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };

  /**
   * Play Pagination func's
   */

  const handlePageChange = (event, value) => {
    setPage(value);
    // update pagination (plays showing)
    playPagination(value);
  };

  const playPagination = (pageNum) => {
    setCurrentStartIndex(page * 5);
    let startIndex = pageNum * 5;

    if (pageNum === 1) {
      startIndex = 0;
    }

    let currentEndIndex = startIndex + 5;
    console.log(startIndex + " " + currentEndIndex);
    let playsCopy = [...playArr.plays];
    let newPlaysToShow = playsCopy.slice(startIndex, currentEndIndex);

    let newDict = {
      plays: newPlaysToShow,
    };
    setCurrentShowingPlays(newDict);
  };

  const setPlayArrowIndexFunc = (val) => {
    // try {
    //   setPlayArrowIndex(playArrowIndex + val);
    // } catch (error) {
    //   console.log("out of bounds");
    // }

    let newIndex = playArrowIndex + val;
    if (newIndex > playArr.plays.length) {
      console.log("out of bounds");
    } else if (newIndex < 0) {
      console.log("out of bounds");
    } else {
      console.log("New Index " + newIndex);
      console.log("Page Num " + Math.ceil(newIndex / 5));
      setPage(Math.ceil(newIndex / 5));
      setPlayArrowIndex(newIndex);
    }
  };

  // Styled chip for autocomplete tags
  const MyChip = (props) => {
    return (
      <Chip
        label={props.label}
        onDelete={() => null}
        variant='outlined'
        sx={{ mr: 0.5, my: 0.1 }}
        avatar={
          <Avatar
            src={
              "https://cdn.nba.com/logos/nba/" +
              props.id +
              "/primary/L/logo.svg"
            }
          />
        }
      />
    );
  };

  /**
   * Use State Functions
   */

  React.useState(() => {
    getSamplePlaysAxios();
  }, []);

  React.useEffect(() => {
    getSamplePlaysAxios();
  }, [currentPlayer]);

  React.useEffect(() => {
    setPageCount(Math.ceil(playArr.plays.length / 5));
    playPagination(1);
  }, [playArr]);

  // -----------------------------------------------------
  // console.log(showProgressBar);
  // console.log(seasonsSelected);
  // console.log(teamsPlayerOn);
  // console.log(matchups);

  // console.log(currentShowingPlays);
  console.log(currentPlayer);
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
          {bigVideoEnabled && (
            <Grid item xs={12}>
              <VideoFrame
                playArr={playArr}
                currentUrl={currentUrl}
                setPlayArr={setPlayArr}
                setCurrentUrl={setCurrentUrl}
                bigVideoEnabled={bigVideoEnabled}
                setBigVideoEnabled={setBigVideoEnabled}
                setPlayArrowIndexFunc={setPlayArrowIndexFunc}
              />
            </Grid>
          )}

          {/* Player Dash, logo name etc */}
          <Grid item xs={5.5} sx={{ my: 1 }}>
            <PlayerCard currentPlayer={currentPlayer} />
            {/* Find plays against matchup autocomplete */}
            <Paper sx={{ mt: 1 }}>
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
                sx={{ width: "90%", padding: 1 }}
                size='small'
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option) => (
                    <MyChip label={option.full_name} id={option.id} />
                  ));
                }}
                onChange={(event, newValue) => {
                  try {
                    let newId = newValue[newValue.length - 1].id;
                    setTeamsPlayerOn((prevState) => [...prevState, newId]);
                  } catch (error) {
                    setTeamsPlayerOn([]);
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
                      label='Find plays when player was on these teams'
                    />
                  </Stack>
                )}
              />
            </Paper>

            {/* Filter By Season */}

            <FilterSnackBar
              filtersShowing={filtersShowing}
              setFiltersShowing={setFiltersShowing}
              clearFilters={clearFilters}
              createSearchResults={createSearchResults}
            />

            {/* Filters Start */}
            <Collapse in={filtersShowing}>
              <Alert
                severity='info'
                sx={{ justifyContent: "center", textAlign: "center" }}>
                All results are returned by default. Choosing a filter type
                (e.g. szn) will only filter that type down, others will remain
                uneffected
              </Alert>
              <Paper sx={{ mt: 1 }}>
                <Paper
                  // elevation={15}
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

              {/* InGame Option */}
              <Grid container>
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(statDict)}
                    dict={statDict}
                    setDict={setStatDict}
                    title={"Stat Type"}
                  />
                </Grid>
                <Grid item xs={6} padding={1}>
                  <Filter
                    arrOfKeys={Object.keys(quarterDict)}
                    dict={quarterDict}
                    setDict={setQuarterDict}
                    title={"Quarter"}
                  />
                </Grid>
              </Grid>
            </Collapse>

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
          </Grid>

          {/* Video preview
              Plays List */}
          <Grid item xs={6} ml={1} mt={1}>
            {!bigVideoEnabled && (
              <VideoFrame
                playArr={playArr}
                currentUrl={currentUrl}
                setPlayArr={setPlayArr}
                setCurrentUrl={setCurrentUrl}
                bigVideoEnabled={bigVideoEnabled}
                setBigVideoEnabled={setBigVideoEnabled}
                setPlayArrowIndexFunc={setPlayArrowIndexFunc}
              />
            )}

            {/* </Box> */}

            <PlayersPlayList
              playByPlay={currentShowingPlays}
              playInVideoPlayer={playArr?.plays[0]}
            />

            {/* if we have more than 5 plays, use paginationi */}
            {playArr.plays.length > 5 && (
              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Pagination
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
