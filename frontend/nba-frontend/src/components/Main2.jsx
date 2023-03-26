import * as React from "react";
import dayjs from "dayjs";
// import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// kimport { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Stack,
  Divider,
  Fade,
  Alert,
  Hidden,
  Avatar,
} from "@mui/material";
import GameList2 from "./GameList2";
import Paper from "@mui/material/Paper";
import TeamSearch from "./ByTeamDash/TeamSearch";
import ChoicesDash from "./ByTeamDash/ChoicesDash";
import SelectionsDash from "./ByTeamDash/SelectionsDash";
import TeamGameList from "./ByTeamDash/TeamGameList";
import NoHighlights from "./PlaysList/NoHighlights.jsx";
import trophyGif from "../static/trophy.gif";
import DateChosenDash from "./DateChosenDash";

import { Link, useLocation, useNavigate } from "react-router-dom";
export default function Main(props) {
  const [locationState, setLocationState] = React.useState(useLocation());
  const [value, setValue] = React.useState(
    locationState.state && locationState.state.valueLink !== ""
      ? locationState.state.valueLink
      : dayjs().subtract(1, "day").toString()
  );
  const navigate = useNavigate();
  const [responseData, setResponseData] = React.useState([]);
  const [shouldRender, setShouldRender] = React.useState(false);
  const [gamesLoading, setGamesLoading] = React.useState(true);
  const [tabValue, setTabValue] = React.useState(
    !locationState.state ? 0 : locationState.state.tabValueLink
  );
  const [selectedTeams, setSelectedTeams] = React.useState(
    !locationState.state ? [{}, {}] : locationState.state.selectedTeamsLink
  );
  const [selectedSeasons, setSelectedSeasons] = React.useState([]);
  const [noGames, setNoGames] = React.useState(false);

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
      navigate("/byDate", {
        state: { tabValueLink: 1, selectedTeamsLink: [{}, {}] },
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
      .post("http://localhost:8000/date", data)
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

  const getSelectedSeasons = (seasonsArr) => {
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
  // console.log(selectedTeams);
  console.log(locationState);
  console.log(value);
  return (
    <>
      <Container maxWidth='xl' sx={{ mt: 1 }}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}>
            <Typography variant='h4' color={"text.secondary"}>
              NBA Clip Finder
            </Typography>

            <Hidden mdDown>
              <Avatar src={trophyGif} sx={{ width: 100, height: 100 }} />
            </Hidden>
          </Stack>
        </Paper>

        <Container maxWidth='lg' sx={{ mt: 1 }}>
          {/* <Grid container>
            <Grid item xs={6}>
              <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
                <TeamSearch />
              </Box>
            </Grid>
          </Grid> */}

          <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
            {/* Tabs */}
            <Grid container spacing={1} paddingTop>
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
                {/* Calendar Picker */}
                {tabValue === 1 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Fade in={true}>
                      <Paper variant='outlined' sx={{ borderRadius: 4 }}>
                        <CalendarPicker
                          minDate={dayjs("2014-10-28")}
                          maxDate={dayjs()}
                          openTo='day'
                          disableHighlightToday
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
                        Games on today only show up once they are in
                        progress/finished, Highlights become available ~20-30
                        minutes after finish
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
                  {tabValue === 0 && responseData?.length > 0 && (
                    <>
                      <Divider sx={{ my: 1, mx: 0 }} />

                      <TeamGameList
                        selectedSeasonsParent={selectedSeasons}
                        gameList={responseData}
                      />

                      {/* <GameList2
                          gameList={this.state.responseData}
                          date={this.state.value}
                          showDate={true}
                        /> */}
                    </>
                  )}

                  {/* No games found */}
                  {noGames && tabValue === 1 && (
                    <>
                      {dayjs(value).format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD").toString() && (
                        <Alert severity='warning'>
                          Games on today only show up once they are in
                          progress/finished, Highlights become available ~20-30
                          minutes after finish
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
                          Games on today only show up once they are in
                          progress/finished, Highlights become available ~20-30
                          minutes after finish
                        </Alert>
                      )}

                      <DateChosenDash
                        date={dayjs(value).format("MM-DD-YYYY").toString()}
                        gamesFound={responseData.length}
                        season={responseData[0].season_str}
                      />
                      <GameList2
                        gameList={responseData}
                        date={value}
                        showDate={false}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Container>
    </>
  );
}
