import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import axios from "axios";
import { Container, Grid, Typography } from "@mui/material";
import GameList2 from "./GameList2";
import Paper from "@mui/material/Paper";

class DateChosen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs("2023-02-04"),
      responseData: [],
      shouldRender: false,
    };
  }
  getGamesAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      value: e.toString(),
    };
    this.setState({ value: e.toString() });
    axios
      .post("http://localhost:8000/date", data)
      .then((response) => {
        //console.log(response.data);
        //const data = JSON.parse(response.data);
        if (response.data !== "no games") {
          this.setState({ responseData: response.data, shouldRender: true });
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

  componentDidMount() {
    this.getGamesAxios(this.state.value);
  }

  render() {
    return (
      <>
        <Container maxWidth='lg' sx={{ mt: 2 }}>
          <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
            <Paper
              elevation={2}
              sx={{
                justifyContent: "center",
                textAlign: "center",
                padding: 1,
              }}>
              <Typography variant='h4'>NBA Clip Finder</Typography>
            </Paper>

            <Grid container spacing={1} paddingTop>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* <StaticDatePicker
                      orientation='landscape'
                      openTo='day'
                      value={this.state.value}
                      onChange={(newValue) => {
                        this.setState({ value: newValue });
                        this.getGamesAxios(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    /> */}
                  <Paper variant='outlined' sx={{ borderRadius: 4 }}>
                    <CalendarPicker
                      openTo='day'
                      onChange={(newValue) => {
                        this.setState({ value: newValue });
                        this.getGamesAxios(newValue);
                      }}
                    />
                  </Paper>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={0.2}>
                  {this.state.shouldRender && (
                    <GameList2
                      gameList={this.state.responseData}
                      date={this.state.value}
                    />
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
