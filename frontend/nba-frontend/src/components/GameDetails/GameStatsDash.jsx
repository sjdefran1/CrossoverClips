import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Grid,
  Typography,
  Chip,
  Paper,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";

//const project = projects[0];
export default function GameStatsDash(props) {
  const [statTypes, setStatTypes] = React.useState([]);

  React.useEffect(() => {
    setStatTypes([
      "FGM",
      "FGA",
      "FG_PCT",
      "FG3M",
      "FG3A",
      "FG3_PCT",
      "FTM",
      "FTA",
      "FT_PCT",
      "OREB",
      "DREB",
      "REB",
      "AST",
      "STL",
      "BLK",
      "TOV",
      "PTS",
    ]);
  }, []);
  return (
    <>
      <Box sx={{ maxWidth: { lg: "100vh", sm: "35vh" } }}>
        <Paper>
          <Stack textAlign={"center"}>
            <Stack direction={"row"} alignItems='center' justifyContent='right'>
              <Box sx={{ mr: { sm: 4, lg: 22.3 } }}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    props.gameInfo.away_info.TEAM_ID +
                    "/primary/L/logo.svg"
                  }
                />
              </Box>

              <Box sx={{ mr: { sm: 5.5, lg: 12.5 } }}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    props.gameInfo.home_info.TEAM_ID +
                    "/primary/L/logo.svg"
                  }
                />
              </Box>
            </Stack>
          </Stack>
        </Paper>
        <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
          {/* <TableContainer component={Paper}> */}
          <Table
            sx={{ maxWidth: { lg: "100vh", sm: "10vh" } }}
            aria-label='simple table'>
            <TableBody>
              {statTypes.map((row) => (
                <TableRow
                  key={row}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component='th' scope='row'>
                    {row}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      color:
                        props.gameInfo.away_info[row] >
                        props.gameInfo.home_info[row]
                          ? "#6fbf73"
                          : "#ffa199",
                    }}>
                    {props.gameInfo.home_info[row] < 1
                      ? (props.gameInfo.home_info[row] * 100).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 2,
                          }
                        ) + "%"
                      : props.gameInfo.home_info[row]}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      color:
                        props.gameInfo.home_info[row] >
                        props.gameInfo.away_info[row]
                          ? "#6fbf73"
                          : "#ffa199",
                    }}>
                    {props.gameInfo.home_info[row] < 1
                      ? (props.gameInfo.home_info[row] * 100).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }
                        ) + "%"
                      : props.gameInfo.home_info[row]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* </TableContainer> */}
        </Box>
      </Box>
    </>
  );
}
