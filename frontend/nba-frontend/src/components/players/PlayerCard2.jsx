import * as React from "react";
import {
  Paper,
  Stack,
  Badge,
  Avatar,
  Typography,
  Chip,
  Divider,
  Fade,
  Grid,
  Hidden,
} from "@mui/material";

import GoatAvatar from "../../static/goat.png";
import NbaCircle from "../../static/nbaCircleLogo.png";
import { styled } from "@mui/material/styles";

export default function PlayerCard2(props) {
  // used for little active/inactive dot on player headshot
  const StyledBadgeActive = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#4caf50",
      color: "#4caf50",
      height: "25px",
      width: "25px",
      borderRadius: "50%",
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.4)",
        opacity: 0,
      },
    },
  }));

  const StyledBadgeInactive = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#ff1744",
      color: "#ff1744",
      height: "25px",
      width: "25px",
      borderRadius: "50%",
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(1.4)",
        opacity: 0,
      },
    },
  }));
  return (
    <Paper sx={{ borderRadius: 2, mt: props.bigVideoEnabled ? 1 : 0 }}>
      <Grid container>
        {/* StyledBadge provides the little green/red circle
          Indicating if Active/inactive */}
        <Grid item xs={3} mx={"auto"} my={"auto"}>
          {props.currentPlayer?.status === "Active" ? (
            <StyledBadgeActive
              overlap='circular'
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              variant='dot'
              sx={{ mb: 1 }}>
              <Avatar
                src={
                  "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                  props.currentPlayer?.playerID +
                  ".png"
                }
                sx={{
                  height: { xs: 115, md: 185 },
                  width: { xs: 115, md: 185 },
                }}
              />
            </StyledBadgeActive>
          ) : (
            <StyledBadgeInactive
              overlap='circular'
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              variant='dot'
              sx={{ mb: 1 }}>
              <Fade in={true}>
                <Avatar
                  src={
                    "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                    props.currentPlayer?.playerID +
                    ".png"
                  }
                  sx={{
                    height: { xs: 85, md: 185 },
                    width: { xs: 85, md: 185 },
                  }}
                />
              </Fade>
            </StyledBadgeInactive>
          )}
        </Grid>

        <Grid item xs={7} justifyContent={"center"} my={"auto"}>
          <Stack direction={"column"} spacing={0.5}>
            {/* Player Name */}
            {/* Some Players don't have first name aka nene */}
            <Typography sx={{ typography: { md: "h4", xs: "h6" } }}>
              {props?.currentPlayer?.fname !== null
                ? props.currentPlayer.fname + " " + props.currentPlayer.lname
                : props.currentPlayer.lname}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={1} mb={2}>
              <Typography variant='body1' color='text.secondary'>
                {props?.currentPlayer?.pos} #{props?.currentPlayer?.jerseynum}
              </Typography>
              <Divider orientation='vertical' />
              {props?.currentPlayer?.status === "Active" ? (
                <>
                  <Avatar
                    src={
                      "https://cdn.nba.com/logos/nba/" +
                      props?.currentPlayer?.teamID +
                      "/primary/L/logo.svg"
                    }
                  />
                </>
              ) : (
                <Avatar src={NbaCircle}></Avatar>
              )}
            </Stack>

            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Chip color='success' label={"Active"} />

              <Chip
                label={props?.currentPlayer?.yrsplayed + " SZN's"}
                color='info'
              />

              {props?.currentPlayer?.goatflag === "Y" && (
                <Hidden smDown>
                  <Chip
                    label='Top 75 List'
                    variant='filled'
                    color='default'
                    avatar={
                      <Avatar
                        src={GoatAvatar}
                        style={{
                          padding: 1,
                          width: 24,
                          height: 24,
                        }}
                      />
                    }></Chip>
                </Hidden>
              )}
            </Stack>
          </Stack>
          <Hidden smUp>
            <Chip
              label='Top 75 List'
              variant='filled'
              color='default'
              sx={{ my: 1 }}
              avatar={
                <Avatar
                  src={GoatAvatar}
                  style={{
                    padding: 1,
                    width: 24,
                    height: 24,
                  }}
                />
              }></Chip>
          </Hidden>
        </Grid>
      </Grid>
    </Paper>
  );
}
