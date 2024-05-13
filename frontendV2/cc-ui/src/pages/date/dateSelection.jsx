import * as React from "react";
import { Typography, Box, Paper, Stack, Divider, Chip } from "@mui/material";
import { useSelector } from "react-redux";

export default function DateSelection(props) {
  const gamesFound = useSelector((state) => state.date.gameList);
  const gamesFoundLen = gamesFound === "no games" ? 0 : gamesFound.length;
  const date = useSelector((state) => state.date.dateStr);
  return (
    <>
      <Box sx={{ minWidth: "100%", textAlign: "center", borderRadius: 4 }}>
        <Paper elevation={5}>
          <Stack
            direction={"row"}
            spacing={1}
            sx={{ justifyContent: "center", alignItems: "center" }}>
            <Box>
              <Chip
                variant='outlined'
                color='info'
                label={"Games Found: " + gamesFoundLen}
                sx={{ my: 1 }}
              />

              <Chip
                variant='outlined'
                color='info'
                label={"Date: " + date}
                sx={{ my: 1 }}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
