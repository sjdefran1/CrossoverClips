import { Avatar, Stack, Typography } from "@mui/material";
import * as React from "react";

export default function PlaySecondary(props) {
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
            props.stuff[4] +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingRight: 1 }}
        />

        <Typography variant='subtitle1' component={"span"}>
          {props.stuff[1]} - {props.stuff[0]}
        </Typography>
        <Avatar
          component={"span"}
          src={
            "https://cdn.nba.com/logos/nba/" +
            props.stuff[3] +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingLeft: 1 }}
        />
      </Stack>
      <Typography variant='subtitle2' component={"span"}>
        {props.stuff[2]}
      </Typography>
    </Stack>
  );
}
