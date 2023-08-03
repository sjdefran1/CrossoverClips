import * as React from "react";
import {
  Paper,
  Grid,
  Stack,
  Box,
  Badge,
  Avatar,
  Typography,
  Chip,
  Container,
  Tooltip,
  TextField,
  Alert,
  FormControl,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  LinearProgress,
  Divider,
  IconButton,
  Link,
  Button,
  Collapse,
  Fade,
  Pagination,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import NbaHeader from "../NbaHeader.jsx";
import NbaFooter from "../NbaFooter";
import GoatAvatar from "../../static/goat.png";
import { styled } from "@mui/material/styles";

import { plays, teams } from "./plays.jsx";
import { reqString } from "../../App";

import PlayersPlayList from "../PlaysList/PlayersPlayList.jsx";
import GameTypeSelect from "../ByTeamDash/GameTypeSelect.jsx";

import TeamLabel from "../ByTeamDash/TeamLabel.jsx";
import SeasonsSelect from "../ByTeamDash/SeasonsSelect.jsx";
import StatFilter from "../GameDetails/StatFilters.jsx";
import QuarterFilter from "./QuarterFilter.jsx";
import PlayStatFilter from "./PlayStatFilter.jsx";
import axios from "axios";
import Filter from "./Filter.jsx";
import FilterSnackBar from "./FilterSnackbar.jsx";
import PlayerSearchBar from "./PlayerSeachBar.jsx";
import PlayerCard from "./PlayerCard.jsx";
import VideoFrame from "./VideoFrame.jsx";

export default function PlayerDash(props) {
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);
  // const [gameType, setGameType] = React.useState([]);
  const [playArr, setPlayArr] = React.useState(plays);
  // const [videoPlayerIndex, setVideoPlayerIndex] = React.useState(0);
  const [showProgressBar, setShowProgressBar] = React.useState(null);
  const [currentUrl, setCurrentUrl] = React.useState(playArr.plays[0]?.url);
  const [filtersShowing, setFiltersShowing] = React.useState(true);

  // pagination
  const [page, setPage] = React.useState(1);
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

    let tempDict = { plays: [] };
    // setPlayArr(tempDict);
    // setCurrentShowingPlays([]);

    setQuarterDict(clearedQuarters);
    setSeasonTypeDict(clearedSeasonType);
    setStatDict(clearedStatType);
    setHomeAwayDict(clearedHomeAway);
    setSeasonsSelected([]);
  };

  const clearFiltersAndGetSamplePlays = async (newPlayer) => {
    setCurrentPlayer(newPlayer);
    clearFilters();
    // getSamplePlaysAxios();
  };

  React.useEffect(() => {
    getSamplePlaysAxios();
  }, [currentPlayer]);

  React.useEffect(() => {
    playPagination(1);
    // setCurrentUrl(playArr.plays[0]);
  }, [playArr]);
  /**
   *
   * @param {*} dict
   * @returns
   */
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
    console.log(currentPlayer);

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
    console.log(currentPlayer);
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
        // setRequestLoading(false);
      })
      .finally(() => {
        // playPagination(1);

        setRequestLoading(false);
      });
  };

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
   * IFrame utils
   * ---------------------------------------------------------
   */
  // const handleLeftArrowClick = async () => {
  //   setShowProgressBar(true);
  //   let playArrCopy = [...playArr.plays];
  //   // user going backwards
  //   // get last arr element and move it the front
  //   let play = playArrCopy.pop();
  //   playArrCopy.unshift(play);

  //   // update views of next play about to be loaded
  //   playArrCopy[0].views = await handleView(playArrCopy[0]);
  //   setPlayArr({ plays: playArrCopy });

  //   // set new url for iframe, and show progress bar to indicate loading
  //   setCurrentUrl(playArrCopy[0].url);
  //   handleView(playArrCopy[0]);
  // };

  // const handleRightArrowClick = async () => {
  //   setShowProgressBar(true);
  //   let playArrCopy = [...playArr.plays];
  //   // move 1st element to end of arr
  //   // allows for current viewing play to move to top
  //   let play = playArrCopy.shift();
  //   playArrCopy.push(play);

  //   // update views of next play about to be loaded
  //   playArrCopy[0].views = await handleView(playArrCopy[0]);
  //   setPlayArr({ plays: playArrCopy });

  //   // set new url for iframe, and show progress bar to indicate loading
  //   setCurrentUrl(playArrCopy[0].url);
  // };

  React.useState(() => {
    getSamplePlaysAxios();
  }, []);

  // -----------------------------------------------------
  // console.log(showProgressBar);
  // console.log(seasonsSelected);
  // console.log(teamsPlayerOn);
  // console.log(matchups);

  // console.log(currentShowingPlays);
  // console.log(currentPlayer);
  return (
    <>
      {/* {requestLoading ? (
        <CircularProgress />
      ) : ( */}
      <>
        <Paper
          sx={
            {
              // background: "#1b1b1b",
              //   "radial-gradient(circle, hsla(0, 0%, 22%, 1) 0%, hsla(0, 100%, 13%, 1) 25%, hsla(216, 53%, 12%, 1) 57%, hsla(0, 0%, 11%, 1) 84%)",
              // backgroundSize: "110% 110%",
              // animation: `${gradient} 4s infinite alternate`,
            }
          }>
          <NbaHeader small={true} />
        </Paper>
        <Container maxWidth={"xl"}>
          <Box ml={"5%"}>
            <PlayerSearchBar
              setCurrentPlayer={setCurrentPlayer}
              clearFiltersAndGetSamplePlays={clearFiltersAndGetSamplePlays}
            />
          </Box>
          <Grid container>
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
                      <TeamLabel
                        team_id={option?.id}
                        name={option?.full_name}
                      />
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
                      <TeamLabel
                        team_id={option?.id}
                        name={option?.full_name}
                      />
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

            {/* spacer between two grid items */}
            {/* <Grid item xs={1}></Grid> */}

            {/* Video preview
              Plays List */}
            <Grid item xs={6} ml={1} mt={1}>
              {/* <Box padding={1} mx={5} minHeight={"40vh"}> */}
              {/* <Paper
                variant='outlined'
                sx={{ textAlign: "center", bgcolor: "#333" }}>
                <Stack
                  direction='row'
                  justifyContent={"center"}
                  spacing={1}
                  alignItems={"center"}>
                  <Chip
                    label={playArr.plays[0]?.ptype}
                    variant='outlined'
                    color='primary'
                    sx={{ my: 0.5 }}
                  />
                  <Chip
                    label={playArr.plays[0]?.matchupstr}
                    variant='outlined'
                    color='info'
                    sx={{ my: 0.5 }}
                  />

                  <Chip
                    label={playArr.plays[0]?.sznstr}
                    variant='outlined'
                    color='primary'
                    sx={{ my: 0.5 }}
                  />
                </Stack>
              </Paper>
              {showProgressBar && <LinearProgress color='success' />}
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                ml={1}
                my={1}>
                <IconButton onClick={handleLeftArrowClick}>
                  <KeyboardArrowLeftIcon fontSize='large' color='info' />
                </IconButton>

                <iframe
                  id='videoIframe'
                  width={!showProgressBar ? "640" : "0"}
                  height={!showProgressBar ? "360" : "0"}
                  // onLoadStart={() => setShowProgressBar(true)}
                  // onLoad={() => setShowProgressBar(false)}
                  onLoad={() => setShowProgressBar(false)}
                  src={currentUrl}
                  frameBorder='0'
                  // seamless
                  allowFullScreen></iframe>

                {showProgressBar && (
                  <Box minHeight={"47.5vh"} width={"100%"}></Box>
                )}
                <IconButton
                  onClick={handleRightArrowClick}
                  sx={{ borderRadius: 5 }}>
                  <KeyboardArrowRightIcon fontSize='large' color='info' />
                </IconButton>
              </Stack> */}
              <VideoFrame
                playArr={playArr}
                currentUrl={currentUrl}
                setPlayArr={setPlayArr}
                setCurrentUrl={setCurrentUrl}
              />
              {/* </Box> */}

              <PlayersPlayList
                playByPlay={currentShowingPlays}
                playInVideoPlayer={playArr?.plays[0]}
              />

              <Box sx={{ width: "100%", textAlign: "center" }}>
                <Pagination
                  page={page}
                  count={Math.round(playArr.plays.length / 10)}
                  onChange={handlePageChange}
                />
              </Box>
            </Grid>

            {/* end of whole grid */}
          </Grid>
        </Container>

        <NbaFooter />
      </>
      {/* )} */}
    </>
  );
}
