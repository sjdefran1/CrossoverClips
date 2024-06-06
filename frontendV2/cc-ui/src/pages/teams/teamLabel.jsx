import * as React from "react";

import { Typography, Stack, Avatar } from "@mui/material";

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
      <Typography
        // variant={{ xs: "subtitle2", md: "body2" }}
        variant='body2'
        color='text.secondary'>
        {props.name}
      </Typography>
    </Stack>
  );
}
