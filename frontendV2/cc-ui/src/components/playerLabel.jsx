import * as React from "react";

import { Typography, Stack, Avatar } from "@mui/material";

export default function PlayerLabel(props) {
  return (
    <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
      <Avatar
        src={
          "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
          props.id +
          ".png"
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
