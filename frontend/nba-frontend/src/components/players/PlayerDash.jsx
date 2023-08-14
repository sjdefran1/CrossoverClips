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
import PlayerCard from "./PlayerCard.jsx";
import VideoFrame from "./VideoFrame.jsx";
import PlayerCard2 from "./PlayerCard2.jsx";

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
  const [requestLoading, setRequestLoading] = React.useState(true);

  // new implementation

  const [pagePlayDict, setPagePlayDict] = React.useState({});
  const [lenPlaysAvailable, setLenPlaysAvailable] = React.useState(0);

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
    console.log(requestOptions);
    // submit request
    submitFilteredSearchAxios(requestOptions);
  };

  const submitFilteredSearchAxios = (options) => {
    setRequestLoading(true);
    axios
      .post(reqString + "players/plays2", options)
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

  const getSamplePlaysAxios = () => {
    setRequestLoading(true);
    let player = {
      pid: currentPlayer.playerID,
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
      console.log("NewIndex " + newIndex);
      setPlayArrowIndex(newIndex);
      // setCurrentUrl(currentShowingPlays.plays[0].url);
      console.log(currentShowingPlays.plays[0].url);
    }
  };

  /**
   * Use Effect Functions
   */

  // when page is first loaded get sample plays
  // atm it gets them for lebron to avoid white screens
  React.useState(() => {
    getSamplePlaysAxios();
  }, []);

  // when a new player is selected from autocomplete
  // get new sample plays
  // retrieves top 20 highlights by view
  React.useEffect(() => {
    getSamplePlaysAxios();
  }, [currentPlayer]);

  // when play is changed updated the url to new highlight at top of array
  // updates videoframe
  React.useEffect(() => {
    setCurrentUrl(currentShowingPlays?.plays[playArrowIndex].url);
  }, [playArrowIndex]);

  // console.log(currentShowingPlays);
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
            {/* <PlayerCard currentPlayer={currentPlayer} /> */}
            <PlayerCard2 currentPlayer={currentPlayer} />
            {/* Find plays against matchup autocomplete */}
            {/* <Paper variant='outlined' sx={{ mt: 1 }}> */}
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
            {/* </Paper> */}
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

            {/* </Box> */}
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
