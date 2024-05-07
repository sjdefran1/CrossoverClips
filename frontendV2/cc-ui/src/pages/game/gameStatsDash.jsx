import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  Box,
  TableRow,
  Paper,
  Stack,
  Avatar,
} from "@mui/material";

import { useSelector } from "react-redux";
//const project = projects[0];
export default function GameStatsDash(props) {
  const homeTeam = useSelector((state) => state.game.homeTeam);
  const awayTeam = useSelector((state) => state.game.awayTeam);

  const statTypes = [
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
  ];

  return (
    <>
      <Box sx={{ maxWidth: { lg: "100vh", sm: "35vh" } }}>
        <Paper>
          <Stack textAlign={"center"}>
            <Stack direction={"row"} alignItems='center' justifyContent='right'>
              <Box sx={{ mr: { xs: 8, lg: 22.3 } }}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    awayTeam.TEAM_ID +
                    "/primary/L/logo.svg"
                  }
                />
              </Box>

              <Box sx={{ mr: { xs: 4, lg: 12.5 } }}>
                <Avatar
                  src={
                    "https://cdn.nba.com/logos/nba/" +
                    homeTeam.TEAM_ID +
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
                        awayTeam[row] > homeTeam[row] ? "#6fbf73" : "#ffa199",
                    }}>
                    {awayTeam[row] < 1
                      ? (awayTeam[row] * 100).toLocaleString("en-US", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                        }) + "%"
                      : awayTeam[row]}
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{
                      color:
                        homeTeam[row] > awayTeam[row] ? "#6fbf73" : "#ffa199",
                    }}>
                    {homeTeam[row] < 1
                      ? (homeTeam[row] * 100).toLocaleString("en-US", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }) + "%"
                      : homeTeam[row]}
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
