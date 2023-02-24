import * as React from "react";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import axios from "axios";
import { Container, Grid } from "@mui/material";

class DateChosen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: dayjs("2023-02-04"),
      responseData: [],
      shouldRender: false,
    };
  }
  submitMessageAxios = (e) => {
    const data = {
      //value: this.state.value.toString(),
      value: e.toString(),
    };
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
  render() {
    return (
      <>
        <Container maxWidth='lg' sx={{ mt: 8 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                  orientation='landscape'
                  openTo='day'
                  value={this.state.value}
                  onChange={(newValue) => {
                    this.setState({ value: newValue });
                    this.submitMessageAxios(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              {this.state.shouldRender &&
                this.state.responseData.map((game) => (
                  <p key={game.gameID}>
                    {game.matchup}: {game.score}
                  </p>
                ))}
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

export default DateChosen;
