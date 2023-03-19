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
} from "@mui/material";
import GameList2 from "./GameList2";
import Paper from "@mui/material/Paper";
import TeamSearch from "./ByTeamDash/TeamSearch";
import ChoicesDash from "./ByTeamDash/ChoicesDash";
import SelectionsDash from "./ByTeamDash/SelectionsDash";
import TeamGameList from "./ByTeamDash/TeamGameList";

class DateChosen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //value: dayjs("2023-02-04"),
      value: dayjs().subtract(1, "day"),
      responseData: [],
      shouldRender: false,
      gamesLoading: true,
      tabValue: 0,
      selectedTeams: [{}, {}],
      selectedSeasons: [],
      //renderToday: true,
    };
  }

  handleTabChange = (event, newVal) => {
    this.setState({ tabValue: newVal, responseData: [] });
  };

  getGamesAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      value: e.toString(),
    };
    this.setState({ value: e.toString(), shouldRender: false });
    axios
      .post("http://localhost:8000/date", data)
      .then((response) => {
        //console.log(response.data);
        //const data = JSON.parse(response.data);
        if (response.data !== "no games") {
          this.setState({
            responseData: response.data,
            shouldRender: true,
            gamesLoading: false,
          });
        } else {
          this.setState({ shouldRender: false });
        }
        //console.log(this.responseData);
        //console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  setResponseData = (gameList) => {
    this.setState({ responseData: gameList });
  };

  setGamesLoading = (val) => {
    this.setState({ gamesLoading: val });
  };

  componentDidMount() {
    //this.setState({ responseData: [] });
    //this.getGamesAxios(this.state.value);
    //window.history.replaceState({}, document.title);
  }

  componentDidUpdate() {
    //window.history.replaceState({}, document.title);
  }

  // componentWillUnmount() {
  //   this.setState({ responseData: [] });
  // }

  getSelectedTeams = (teamsArr) => {
    this.setState({ selectedTeams: teamsArr, responseData: [] });
  };

  getSelectedSeasons = (seasonsArr) => {
    this.setState({ selectedSeasons: seasonsArr, responseData: [] });
  };

  // disableYear(year) {
  //   console.log(year);
  //   if (year < 2014) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  render() {
    return (
      <>
        <Container maxWidth='lg' sx={{ mt: 2 }}>
          {/* <Grid container>
            <Grid item xs={6}>
              <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
                <TeamSearch />
              </Box>
            </Grid>
          </Grid> */}

          <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
            <Paper
              elevation={2}
              sx={{
                justifyContent: "center",
                textAlign: "center",
                padding: 1,
              }}>
              <Typography variant='h4' color={"text.secondary"}>
                NBA Clip Finder
              </Typography>
            </Paper>

            <Grid container spacing={1} paddingTop>
              <Grid item xs={6}>
                <Box sx={{ width: "100%" }}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider", mb: 0.5 }}>
                    <Tabs
                      centered
                      value={this.state.tabValue}
                      onChange={this.handleTabChange}
                      aria-label='Filters or Game Stats'>
                      <Tab label='Choose By Team' tabIndex={0} />
                      <Tab label='Choose By Date' tabIndex={1} />
                    </Tabs>
                  </Box>
                </Box>
                {this.state.tabValue === 1 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Fade in={true}>
                      <Paper variant='outlined' sx={{ borderRadius: 4 }}>
                        <CalendarPicker
                          minDate={dayjs("2014-10-28")}
                          maxDate={dayjs()}
                          openTo='day'
                          disableHighlightToday
                          onChange={(newValue) => {
                            this.setState({
                              value: newValue.format("YYYY-MM-DD"),
                              gamesLoading: true,
                              shouldRender: false,
                            });
                            this.getGamesAxios(newValue);
                          }}
                        />
                      </Paper>
                    </Fade>
                  </LocalizationProvider>
                )}

                {this.state.tabValue === 0 && (
                  // <Grid container>
                  // <Grid item xs={12}>
                  <Box
                    sx={{
                      maxHeight: "70vh",
                      overflow: "auto",
                    }}>
                    <ChoicesDash
                      updateSelectedTeams={this.getSelectedTeams}
                      updateSelectedSeasons={this.getSelectedSeasons}
                      updateGameList={this.setResponseData}
                      updateGamesLoading={this.setGamesLoading}
                      setResponseData={this.setResponseData}
                    />
                  </Box>
                  // </Grid>
                  // </Grid>
                )}
              </Grid>

              <Grid item xs={6}>
                {this.state.tabValue === 0 && (
                  <SelectionsDash
                    selectedTeamsParent={this.state.selectedTeams}
                    selectedSeasonsParent={this.state.selectedSeasons}
                  />
                )}
                <Grid
                  container
                  spacing={0.2}
                  sx={{ maxHeight: "60vh", overflow: "auto" }}>
                  {/* Game List for Team Select */}
                  {this.state.tabValue === 0 &&
                    this.state.responseData?.length > 0 && (
                      <>
                        <Divider sx={{ my: 1, mx: 0 }} />

                        <TeamGameList
                          selectedSeasonsParent={this.state.selectedSeasons}
                          gameList={this.state.responseData}
                        />

                        {/* <GameList2
                          gameList={this.state.responseData}
                          date={this.state.value}
                          showDate={true}
                        /> */}
                      </>
                    )}

                  {/* Today */}
                  {/* {this.state.shouldRender && this.state.renderToday && (
                    <p>today</p>
                  )} */}
                  {/* Not Today */}
                  {/* {this.state.shouldRender && !this.state.renderToday && ( */}
                  {this.state.gamesLoading && this.state.tabValue === 1 && (
                    // <Grid item xs={6}>
                    // <br></br>
                    <CircularProgress sx={{ ml: "50%" }} />
                    // </Grid>
                  )}

                  {/* {this.state.gamesLoading &&
                    this.state.tabValue === 0 &&
                    this.state.shouldRender && (
                      <Grid item xs={6}>
                        <br></br>
                        <CircularProgress sx={{ ml: "50%" }} />
                      </Grid>
                    )} */}

                  {this.state.shouldRender && this.state.tabValue === 1 && (
                    <>
                      {dayjs(this.state.value).format("YYYY-MM-DD") ===
                        dayjs().format("YYYY-MM-DD").toString() && (
                        <Alert severity='warning'>
                          Games on today only show up once they are in
                          progress/finished, Highlights become available ~20-30
                          minutes after finish
                        </Alert>
                      )}

                      <GameList2
                        gameList={this.state.responseData}
                        date={this.state.value}
                        showDate={false}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* <Grid container spacing={1}>
            {this.state.shouldRender && (
              <GameList2
                gameList={this.state.responseData}
                date={this.state.value}
              />
            )}
          </Grid> */}
        </Container>
      </>
    );
  }
}

export default DateChosen;
