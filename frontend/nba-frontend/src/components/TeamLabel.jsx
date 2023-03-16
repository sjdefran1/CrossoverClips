import * as React from "react";

import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Stack,
  Fade,
  Box,
  FormControlLabel,
  Checkbox,
  Avatar,
} from "@mui/material";

export default function TeamLabel(props) {
  return (
    <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
      <Avatar
        src={
          "https://cdn.nba.com/logos/nba/" +
          props.team_id +
          "/primary/L/logo.svg"
        }
      />
      <Typography variant='body2' color='text.secondary'>
        {props.name}
      </Typography>
    </Stack>
  );
}
