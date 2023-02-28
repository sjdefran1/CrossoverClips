import { Avatar, Stack, Typography } from "@mui/material";

export default function PlaySecondary(props) {
  return (
    <Stack direction={"column"} sx={{ justifyContent: "center" }}>
      <Stack
        direction={"row"}
        paddingTop
        paddingBottom
        sx={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          src={
            "https://cdn.nba.com/logos/nba/" +
            props.stuff[4] +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingRight: 1 }}
        />

        <Typography variant='subtitle1'>
          {props.stuff[0]} - {props.stuff[1]}
        </Typography>
        <Avatar
          src={
            "https://cdn.nba.com/logos/nba/" +
            props.stuff[3] +
            "/primary/L/logo.svg"
          }
          sx={{ width: 32, height: 32, paddingLeft: 1 }}
        />
      </Stack>
      <Typography variant='subtitle2'>{props.stuff[2]}</Typography>
    </Stack>
  );
}
