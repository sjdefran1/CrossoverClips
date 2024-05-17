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
import { useSelector } from "react-redux";
import GoatAvatar from "../../static/goat.png";
import NbaCircle from "../../static/nbaCircleLogo.png";

export default function PlayerCard() {
  // const StyledBadgeActive = styled(Badge)(({ theme }) => ({
  //     "& .MuiBadge-badge": {
  //       backgroundColor: "#4caf50",
  //       color: "#4caf50",
  //       height: "25px",
  //       width: "25px",
  //       borderRadius: "50%",
  //       boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
  //       "&::after": {
  //         position: "absolute",
  //         top: 0,
  //         left: 0,
  //         width: "100%",
  //         height: "100%",
  //         borderRadius: "50%",
  //         animation: "ripple 1.2s infinite ease-in-out",
  //         border: "1px solid currentColor",
  //         content: '""',
  //       },
  //     },
  //     "@keyframes ripple": {
  //       "0%": {
  //         transform: "scale(.8)",
  //         opacity: 1,
  //       },
  //       "100%": {
  //         transform: "scale(1.4)",
  //         opacity: 0,
  //       },
  //     },
  //   }));

  //   const StyledBadgeInactive = styled(Badge)(({ theme }) => ({
  //     "& .MuiBadge-badge": {
  //       backgroundColor: "#ff1744",
  //       color: "#ff1744",
  //       height: "25px",
  //       width: "25px",
  //       borderRadius: "50%",
  //       boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
  //       "&::after": {
  //         position: "absolute",
  //         top: 0,
  //         left: 0,
  //         width: "100%",
  //         height: "100%",
  //         borderRadius: "50%",
  //         animation: "ripple 1.2s infinite ease-in-out",
  //         border: "1px solid currentColor",
  //         content: '""',
  //       },
  //     },
  //     "@keyframes ripple": {
  //       "0%": {
  //         transform: "scale(.8)",
  //         opacity: 1,
  //       },
  //       "100%": {
  //         transform: "scale(1.4)",
  //         opacity: 0,
  //       },
  //     },
  //   }));
  const currentPlayer = useSelector((state) => state.player.currentPlayer);

  return (
    <>
      <Paper sx={{ borderRadius: 2 /**mt: props.bigVideoEnabled ? 1 : 0**/ }}>
        <Grid container>
          {/* StyledBadge provides the little green/red circle
        Indicating if Active/inactive */}
          <Grid item xs={3} mx={"auto"} my={"auto"}>
            <Avatar
              src={
                "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                currentPlayer.playerID +
                ".png"
              }
              sx={{
                height: { xs: 115, md: 185 },
                width: { xs: 115, md: 185 },
              }}
            />
          </Grid>

          <Grid item xs={7} justifyContent={"center"} my={"auto"}>
            <Stack direction={"column"} spacing={0.5}>
              {/* Player Name */}
              {/* Some Players don't have first name aka nene */}

              <Typography sx={{ typography: { md: "h4", xs: "h6" } }}>
                {currentPlayer.fname !== null
                  ? currentPlayer.fname + " " + currentPlayer.lname
                  : currentPlayer.lname}
              </Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={1} mb={2}>
                <Typography variant='body1' color='text.secondary'>
                  {currentPlayer.pos} #{currentPlayer.jerseynum}
                </Typography>
                <Divider orientation='vertical' />
                {currentPlayer.status === "Active" ? (
                  <>
                    <Avatar
                      src={
                        "https://cdn.nba.com/logos/nba/" +
                        currentPlayer.teamID +
                        "/primary/L/logo.svg"
                      }
                    />
                  </>
                ) : (
                  <Avatar src={NbaCircle}></Avatar>
                )}
              </Stack>

              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Chip
                  color={
                    currentPlayer.status === "Active" ? "success" : "default"
                  }
                  label={
                    currentPlayer.status === "Active" ? "Active" : "Inactive"
                  }
                />

                <Chip label={currentPlayer.yrsplayed + " SZN's"} color='info' />

                {currentPlayer.goatflag === "Y" && (
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

            {currentPlayer.goatflag === "Y" && (
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
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
