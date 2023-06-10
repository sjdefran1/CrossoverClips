import * as React from "react";
import dayjs from "dayjs";

// import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// kimport { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
// import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Typography, keyframes } from "@mui/material";

import axios from "axios";
import {
  Container,
  Grid,
  // Typography,
  // CircularProgress,
  Box,
  Tabs,
  Tab,
  Stack,
  Divider,
  Fade,
  Alert,
  Hidden,
  // Avatar,
  LinearProgress,
  TextField,
} from "@mui/material";
import GameList2 from "./GameList2";
import Paper from "@mui/material/Paper";
// import TeamSearch from "./ByTeamDash/TeamSearch";
import ChoicesDash from "./ByTeamDash/ChoicesDash";
import SelectionsDash from "./ByTeamDash/SelectionsDash";
import TeamGameList from "./ByTeamDash/TeamGameList";
import TeamGameList2 from "./ByTeamDash/TeamGameList2";
import NoHighlights from "./PlaysList/NoHighlights.jsx";
import trophyGif from "../static/trophy.gif";
// import headerBG from "../static/header.gif";
// import headerStatic from "../static/headerStatic.png";
import DateChosenDash from "./DateChosenDash";
import NbaHeader from "./NbaHeader";
import { reqString } from "../App.js";

import { Link, useLocation, useNavigate } from "react-router-dom";
import NbaFooter from "./NbaFooter";
export default function Main(props) {
  const [locationState, setLocationState] = React.useState(useLocation());
  const [value, setValue] = React.useState(
    locationState.state && locationState.state.valueLink !== ""
      ? locationState.state.valueLink
      : dayjs().format("YYYY-MM-DD").toString()
  );
  const navigate = useNavigate();
  const [responseData, setResponseData] = React.useState([]);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [gamesLoading, setGamesLoading] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(
    !locationState.state ? 0 : locationState.state.tabValueLink
  );
  const [selectedTeams, setSelectedTeams] = React.useState(
    !locationState.state ? [{}, {}] : locationState.state.selectedTeamsLink
  );
  const [selectedSeasons, setSelectedSeasons] = React.useState([]);
  const [noGames, setNoGames] = React.useState(false);
  // const gifUrl = `url(${headerBG}) no-repeat`;

  const handleTabChange = (event, newVal) => {
    //this.setState({ tabValue: newVal, responseData: [] });
    setTabValue(newVal);
    setResponseData([]);

    if (newVal === 0) {
      navigate("/");
    }
    if (newVal === 1) {
      //this.setState({ value: dayjs().subtract(1, "day").toString() });
      //this.getGamesAxios(this.state.value);
      setValue(dayjs().subtract(1, "day").toString());
      getGamesAxios(value);
      // const location = {
      //   pathname: "/somewhere",
      //   state: { fromDashboard: true },
      // };
      navigate("/byDate/" + dayjs().format("YYYY-MM-DD").toString(), {
        state: {
          tabValueLink: 1,
          selectedTeamsLink: [{}, {}],
          valueLink: dayjs().format("YYYY-MM-DD"),
        },
      });
    }
  };

  const getGamesAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      value: e.toString(),
    };
    //this.setState({ value: e.toString(), shouldRender: false });
    setValue(e.toString());
    setShouldRender(false);
    axios
      // .post("http://localhost:8000/date", data)
      .post(reqString + "date", data)
      .then((response) => {
        if (response.data !== "no games") {
          //   this.setState({
          //     responseData: response.data,
          //     shouldRender: true,
          //     gamesLoading: false,
          //     noGames: false,
          //   });
          setResponseData(response.data);
          setShouldRender(true);
          setGamesLoading(false);
          setNoGames(false);
        } else {
          //this.setState({ shouldRender: false, noGames: true });
          setShouldRender(false);
          setGamesLoading(false);
          setNoGames(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   const setResponseData = (gameList) => {
  //     this.setState({ responseData: gameList });
  //   };

  //   const setGamesLoading = (val) => {
  //     this.setState({ gamesLoading: val });
  //   };

  const getSelectedTeams = (teamsArr) => {
    setSelectedTeams(teamsArr);
    setResponseData([]);

    //this.setState({ selectedTeams: teamsArr, responseData: [] });
  };
  // const getSelectedSeasons = React.useCallback((seasonsArr) => {

  // }, [responseData])
  const getSelectedSeasons = (seasonsArr) => {
    // if (responseData?.seasons_list != seasonsArr) {
    //   setSelectedSeasons(responseData?.seasons_list);
    //   return;
    // }
    setSelectedSeasons(seasonsArr);
    setResponseData([]);
    //this.setState({ selectedSeasons: seasonsArr, responseData: [] });
  };

  React.useEffect(() => {
    //console.log([locationState.pathname, locationState.state, "ayo"]);
    //console.log(selectedTeams);
    if (tabValue === 1) {
      getGamesAxios(value);
    }
  }, [locationState]);

  React.useEffect(() => {
    //console.log(selectedTeams);
  }, [selectedTeams]);
  // console.log("Main ");
  // // console.log(selectedTeams);
  // console.log(locationState);
  // console.log(value);

  const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 70%;
  }`;

  return (
    <>
      <Container maxWidth='xl' sx={{ mt: 1 }}>
        <Paper
          sx={
            {
              // background: "#1b1b1b",
              //   "radial-gradient(circle, hsla(0, 0%, 22%, 1) 0%, hsla(0, 100%, 13%, 1) 25%, hsla(216, 53%, 12%, 1) 57%, hsla(0, 0%, 11%, 1) 84%)",
              // backgroundSize: "110% 110%",
              // animation: `${gradient} 4s infinite alternate`,
            }
          }>
          <NbaHeader />
        </Paper>

        <Container maxWidth='lg' sx={{ mt: 2 }}>
          {/* <Grid container>
            <Grid item xs={6}>
              <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
                <TeamSearch />
              </Box>
            </Grid>
          </Grid> */}

          <Paper
            elevation={1}
            sx={{ padding: 2, borderRadius: 2, minHeight: "70vh" }}>
            {/* Tabs */}
            <Grid container spacing={1} paddingTop={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5 }}>
                    <Tabs
                      centered
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label='Filters or Game Stats'>
                      <Tab label='Choose By Team' tabIndex={0} />
                      {/* <Link> */}
                      <Tab label='Choose By Date' tabIndex={1} />
                      {/* </Link> */}
                    </Tabs>
                  </Box>
                </Box>
                <Hidden smUp>
                  {tabValue === 0 && (
                    <SelectionsDash
                      selectedTeamsParent={selectedTeams}
                      selectedSeasonsParent={selectedSeasons}
                    />
                  )}
                </Hidden>

                <Hidden smUp>
                  {tabValue === 0 && gamesLoading && (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress color='success' />
                    </Box>
                  )}
                </Hidden>
                {/* Calendar Picker */}

                {tabValue === 1 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Fade in={true}>
                      <Paper
                        variant='outlined'
                        sx={{ borderRadius: 4, overflow: "auto" }}>
                        {/* <CalendarPicker
                          minDate={dayjs("2014-10-28")}
                          maxDate={dayjs()}
                          //openTo='day'

                          onChange={(newValue) => {
                            navigate(
                              "/byDate/" + newValue.format("YYYY-MM-DD"),
                              {
                                state: {
                                  tabValueLink: 1,
                                  selectedTeamsLink: [{}, {}],
                                  valueLink: newValue.format("YYYY-MM-DD"),
                                },
                              }
                            );
                            // this.setState({
                            //   value: newValue.format("YYYY-MM-DD"),
                            //   gamesLoading: true,
                            //   shouldRender: false,
                            // });
                            // this.getGamesAxios(newValue);
                            setValue(newValue.format("YYYY-MM-DD"));
                            setGamesLoading(true);
                            setShouldRender(false);
                            getGamesAxios(newValue);
                          }}
                        /> */}
                        {tabValue === 1 && gamesLoading && (
                          <Box sx={{ width: "100%" }}>
                            {/* <CircularProgress /> */}
                            <LinearProgress color='success' />
                          </Box>
                        )}
                        <StaticDatePicker
                          orientation='landscape'
                          openTo='day'
                          value={value}
                          showToolbar={false}
                          minDate={dayjs("2014-10-28")}
                          maxDate={dayjs()}
                          // className='calendar'
                          // shouldDisableDate={isWeekend}
                          onChange={(newValue) => {
                            navigate(
                              "/byDate/" + newValue.format("YYYY-MM-DD"),
                              {
                                state: {
                                  tabValueLink: 1,
                                  selectedTeamsLink: [{}, {}],
                                  valueLink: newValue.format("YYYY-MM-DD"),
                                },
                              }
                            );
                            setValue(newValue.format("YYYY-MM-DD"));
                            setGamesLoading(true);
                            setShouldRender(false);
                            getGamesAxios(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Paper>
                    </Fade>
                  </LocalizationProvider>
                )}

                {/* Search By team filters */}
                {tabValue === 0 && (
                  // <Box
                  //   sx={{
                  //     maxHeight: "70vh",
                  //     overflow: "auto",
                  //   }}>
                  <ChoicesDash
                    updateSelectedTeams={getSelectedTeams}
                    updateSelectedSeasons={getSelectedSeasons}
                    updateGameList={setResponseData}
                    updateNoGames={setNoGames}
                    updateShouldRender={setShouldRender}
                    updateGamesLoading={setGamesLoading}
                    setResponseData={setResponseData}
                  />
                  // </Box>
                  // </Grid>
                  // </Grid>
                )}
              </Grid>

              {/* Right hand side of main */}
              <Grid item xs={12} md={6}>
                {/* Selections dash Desktop*/}
                <Hidden smDown>
                  {tabValue === 0 && (
                    <SelectionsDash
                      selectedTeamsParent={selectedTeams}
                      selectedSeasonsParent={selectedSeasons}
                    />
                    // <SelectionsDash
                    //   selectedTeamsParent={
                    //     !locationState.state
                    //       ? selectedTeams
                    //       : locationState.state.selectedTeams
                    //   }
                    //   selectedSeasonsParent={selectedSeasons}
                    // />
                  )}
                </Hidden>

                {/* Games on today w/ alert, no games available yet */}
                {gamesLoading && tabValue === 1 && noGames === false && (
                  <>
                    {dayjs(value).format("YYYY-MM-DD") ===
                      dayjs().format("YYYY-MM-DD").toString() && (
                      <Alert severity='warning'>
                        Todays games only show up once they are in
                        progress/finished. Highlights become available ~20-30
                        minutes after the game finishes.
                      </Alert>
                    )}
                  </>
                )}

                {/* Game Lists */}
                <Grid
                  container
                  spacing={0.2}
                  sx={{ maxHeight: "60vh", overflow: "auto" }}>
                  {/* Game List for Team Select */}

                  <Hidden smDown>
                    {tabValue === 0 && gamesLoading && (
                      // <Box sx={{ width: "100%" }} alignItems={"center"}>
                      //   <LinearProgress color='success' />
                      //   <img
                      //     src={trophyGif}
                      //     style={{ height: "100px", width: "100px" }}></img>
                      // </Box>

                      <Stack
                        sx={{ width: "100%" }}
                        alignItems={"center"}
                        direction={"row"}>
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress color='success' />
                        </Box>

                        <img
                          src={trophyGif}
                          style={{ height: "50px", width: "50px" }}></img>
                      </Stack>
                    )}
                  </Hidden>
                  {tabValue === 0 && responseData?.seasons_list?.length > 0 && (
                    <>
                      <Divider sx={{ my: 1, mx: 0 }} />
                      {/* <TeamGameList
                        selectedSeasonsParent={selectedSeasons}
                        gameList={responseData}
                      /> */}
                      <TeamGameList2
                        seasonsList={responseData.seasons_list}
                        gameList={responseData.games_dict}
                      />

                      {/* <GameList2
                          gameList={this.state.responseData}
                          date={this.state.value}
                          showDate={true}
                        /> */}
                    </>
                  )}

                  {/* No games found */}
                  {noGames && tabValue === 1 && !gamesLoading && (
                    <>
                      {dayjs(value).format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD").toString() && (
                        <Alert severity='warning'>
                          Todays games only show up once they are in
                          progress/finished. Highlights become available ~20-30
                          minutes after the game finishes.
                        </Alert>
                      )}
                      <NoHighlights gamePicker={true} />
                    </>
                  )}
                  {/* Games on today, some have become available/all */}

                  {shouldRender && tabValue === 1 && (
                    <>
                      {dayjs(value).format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD").toString() && (
                        <Alert severity='warning'>
                          Todays games only show up once they are in
                          progress/finished. Highlights become available ~20-30
                          minutes after the game finishes.
                        </Alert>
                      )}
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <Fade in={true} timeout={600}>
                          <div>
                            <DateChosenDash
                              date={dayjs(value)
                                .format("MM-DD-YYYY")
                                .toString()}
                              gamesFound={responseData.length}
                              season={responseData[0].season_str}
                            />
                          </div>
                        </Fade>
                      </Box>
                      <GameList2
                        gameList={responseData}
                        date={value}
                        showDate={false}
                      />
                    </>
                  )}

                  {noGames && tabValue === 0 && shouldRender && (
                    <>
                      <NoHighlights isPlay={false} isGameSelect={true} />
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* <a href='/howto'>
          <Typography>Hello</Typography>
        </a> */}
        <NbaFooter />
      </Container>
    </>
  );
}
