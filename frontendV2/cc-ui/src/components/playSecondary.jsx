import { Avatar, Stack, Typography, Chip } from "@mui/material";
import * as React from "react";

export default function PlaySecondary({ meta }) {
  return (
    <Stack
      component={"span"}
      direction={"column"}
      sx={{ justifyContent: "center" }}>
      <Stack
        direction={"row"}
        paddingTop
        paddingBottom
        component={"span"}
        sx={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          component={"span"}
          src={
            "https://cdn.nba.com/logos/nba/" +
            meta.awayTeamId +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingRight: 1 }}
        />

        <Typography variant='subtitle1' component={"span"}>
          {meta.score}
        </Typography>
        <Avatar
          component={"span"}
          src={
            "https://cdn.nba.com/logos/nba/" +
            meta.homeTeamId +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingLeft: 1 }}
        />
      </Stack>
      <Stack direction={"column"} spacing={1} sx={{ justifyContent: "center" }}>
        <Typography variant='subtitle2' component={"span"}>
          {meta.time}
        </Typography>
        <Typography variant='subtitle2' component={"span"}>
          {"Q" + meta.quarter}
        </Typography>
      </Stack>
    </Stack>
  );
}
