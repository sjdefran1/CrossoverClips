import { Avatar, Stack, Typography, Chip } from "@mui/material";
import * as React from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

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
          {props.stuff[1]}
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
      <Stack direction={"column"} spacing={1} sx={{ justifyContent: "center" }}>
        <Typography variant='subtitle2' component={"span"}>
          {props.stuff[2]}
        </Typography>
        <Typography variant='subtitle2' component={"span"}>
          {"Q" + props.stuff[5]}
        </Typography>
      </Stack>
    </Stack>
  );
}
