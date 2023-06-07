import * as React from "react";
import { Typography, Box, Paper, Stack, Divider, Chip } from "@mui/material";

export default function DateChosenDash(props) {
  return (
    <>
      <Box sx={{ minWidth: "100%", textAlign: "center", borderRadius: 4 }}>
        <Paper elevation={5}>
          <Stack
            direction={"row"}
            spacing={1}
            divider={<Divider />}
            sx={{ justifyContent: "center", alignItems: "center" }}>
            <Chip
              variant='outlined'
              color='info'
              label={"Games Found: " + props.gamesFound}
              sx={{ my: 1 }}
            />

            <Chip
              variant='outlined'
              color='info'
              label={"Season: " + props.season}
              sx={{ my: 1 }}
            />
          </Stack>
        </Paper>
      </Box>
    </>
  );
}
