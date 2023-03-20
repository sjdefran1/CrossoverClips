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
} from "@mui/material";
import GameList2 from "./GameList2";
import Paper from "@mui/material/Paper";
import TeamSearch from "./ByTeamDash/TeamSearch";
import ChoicesDash from "./ByTeamDash/ChoicesDash";
import SelectionsDash from "./ByTeamDash/SelectionsDash";
import TeamGameList from "./ByTeamDash/TeamGameList";
import NoHighlights from "./PlaysList/NoHighlights.jsx";

class DateChosen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //value: dayjs("2023-02-04"),
      value: dayjs().subtract(1, "day").toString(),
      responseData: [],
      shouldRender: false,
      gamesLoading: true,
      tabValue: 0,
      selectedTeams: [{}, {}],
      selectedSeasons: [],
      noGames: false,
      //renderToday: true,
    };
  }

  handleTabChange = (event, newVal) => {
    this.setState({ tabValue: newVal, responseData: [] });

    if (newVal == 1) {
      this.setState({ value: dayjs().subtract(1, "day").toString() });
      this.getGamesAxios(this.state.value);
    }
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
        if (response.data !== "no games") {
          this.setState({
            responseData: response.data,
            shouldRender: true,
            gamesLoading: false,
            noGames: false,
          });
        } else {
          this.setState({ shouldRender: false, noGames: true });
        }
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

            {/* Tabs */}
            <Grid container spacing={1} paddingTop>
              <Grid item xs={12} md={6}>
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
                <Hidden smUp>
                  {this.state.tabValue === 0 && (
                    <SelectionsDash
                      selectedTeamsParent={this.state.selectedTeams}
                      selectedSeasonsParent={this.state.selectedSeasons}
                    />
                  )}
                </Hidden>
                {/* Calendar Picker */}
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

                {/* Search By team filters */}
                {this.state.tabValue === 0 && (
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

              {/* Right hand side of main */}
              <Grid item xs={12} md={6}>
                {/* Selections dash Desktop*/}
                <Hidden smDown>
                  {this.state.tabValue === 0 && (
                    <SelectionsDash
                      selectedTeamsParent={this.state.selectedTeams}
                      selectedSeasonsParent={this.state.selectedSeasons}
                    />
                  )}
                </Hidden>
                {/* Games on today w/ alert, no games available yet */}
                {this.state.gamesLoading &&
                  this.state.tabValue === 1 &&
                  this.state.noGames == false && (
                    <>
                      {dayjs(this.state.value).format("YYYY-MM-DD") ===
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

                  {/* No games found */}
                  {this.state.noGames && <NoHighlights gamePicker={true} />}
                  {/* Games on today, some have become available/all */}
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
        </Container>
      </>
    );
  }
}

export default DateChosen;
