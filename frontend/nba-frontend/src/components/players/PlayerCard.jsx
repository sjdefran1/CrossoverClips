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
} from "@mui/material";

import GoatAvatar from "../../static/goat.png";
import { styled } from "@mui/material/styles";

export default function PlayerCard(props) {
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
    <Paper sx={{ borderRadius: 2 }}>
      <Stack direction={"row"} alignItems={"center"} spacing={3} ml={5}>
        {/* StyledBadge provides the little green/red circle
          Indicating if Active/inactive */}

        {props.currentPlayer?.status === "Active" ? (
          <StyledBadgeActive
            overlap='circular'
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            variant='dot'
            sx={{ mb: 1 }}>
            <Avatar
              src={
                "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                props.currentPlayer.playerID +
                ".png"
              }
              sx={{
                height: 185,
                width: 185,
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
                  props.currentPlayer.playerID +
                  ".png"
                }
                sx={{
                  height: 185,
                  width: 185,
                }}
              />
            </Fade>
          </StyledBadgeInactive>
        )}

        <div>
          <Divider orientation='vertical' />
        </div>

        <Stack direction={"column"} spacing={0.5}>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Typography variant='h4'>
              {props.currentPlayer.fname + " " + props.currentPlayer.lname}
            </Typography>

            {props.currentPlayer?.status === "Active" ? (
              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  props.currentPlayer.teamID +
                  "/primary/L/logo.svg"
                }
              />
            ) : (
              <Avatar>FA</Avatar>
            )}
          </Stack>

          <Typography variant='body1' color='text.secondary'>
            {props.currentPlayer.pos} #{props.currentPlayer.jerseynum}
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Chip color='success' label={"Active"} />

            <Chip
              label={props.currentPlayer.yrsplayed + " SZN's"}
              color='info'
            />

            {props.currentPlayer.goatFlag === "Y" && (
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
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
