import * as React from "react";
import Box from "@mui/material/Box";
import { Avatar, Grid, Chip, Divider } from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { reqString } from "../App.js";
import { keyframes } from "@mui/material";

//import Link from "@mui/material/Link";
import { Link } from "react-router-dom";

export default function GameList2(props) {
  React.useEffect(() => {}, [props.gameList]);

  let delays = ["2s", "1s", "0.5s"];
  const updateViewCount = (e) => {
    const data = {
      gameID: e,
    };
    axios
      .post(reqString + "updateViewCount", data)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const gradient = keyframes`
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 70%;
    }`;
  return (
    <>
      {props.gameList.map((game) => (
        <Grid item xs={12} sm={6}>
          <Box sx={{ overflow: "hidden" }}>
            {/* Check if game is over */}
            {game.away_info.WL === null ? (
              <React.Fragment key={game.game_id}>
                <Fade in={true} timeout={800}>
                  <Paper
                    variant='outlined'
                    sx={{
                      "&:hover": {
                        backgroundColor: "#ffffff14",
                      },
                      borderRadius: 2,
                      padding: 0.5,
                    }}>
                    <Stack
                      direction='row'
                      spacing={1}
                      sx={{ justifyContent: "center", alignItems: "center" }}>
                      <Tooltip title="Game in Progress/Just Finished. Highlights aren't available until around 20-30 minutes after game ends.">
                        <InfoIcon color='error' sx={{ height: "20px" }} />
                      </Tooltip>

                      <Avatar
                        sx={{ width: 50, height: 50 }}
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          game.away_info.TEAM_ID +
                          "/primary/L/logo.svg"
                        }></Avatar>
                      <Stack
                        direction='column'
                        sx={{ textAlign: "center", fontFamily: "Roboto" }}>
                        <Typography variant='body1'>
                          {game.away_info.MATCHUP}
                        </Typography>
                      </Stack>

                      <Avatar
                        sx={{ width: 50, height: 50 }}
                        src={
                          "https://cdn.nba.com/logos/nba/" +
                          game.home_info.TEAM_ID +
                          "/primary/L/logo.svg"
                        }></Avatar>
                    </Stack>
                  </Paper>
                </Fade>
              </React.Fragment>
            ) : (
              <React.Fragment key={game.game_id}>
                <Link
                  to={"/games/" + game.date + "/" + game.game_id}
                  onClick={() => updateViewCount(game.game_id)}
                  state={{ game_link: game }}
                  style={{ textDecoration: "none" }}>
                  <Fade in={true} timeout={800}>
                    <Paper
                      variant='outlined'
                      sx={{
                        "&:hover": {
                          backgroundColor: "#ffffff14",
                        },
                        borderRadius: 2,
                        padding: 0.5,
                      }}>
                      {game?.playoff_flag === 1 ? (
                        <>
                          <Box
                            sx={{
                              background:
                                "linear-gradient(90deg, hsla(213, 77%, 14%, 1) 0%, hsla(202, 27%, 45%, 1) 100%)",
                              backgroundSize: "300% 300%",
                              borderRadius: 2,
                              backgroundPosition: "left",
                              animation: `${gradient} 7s infinite running alternate`,
                              animationDelay:
                                delays[
                                  Math.floor(Math.random() * delays.length)
                                ],
                            }}>
                            <Typography
                              variant='subtitle2'
                              color={"text.secondary"}
                              sx={{
                                textAlign: "center",
                              }}>
                              Playoff Game
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 0.5 }} />
                        </>
                      ) : (
                        <>
                          <Typography
                            variant='subtitle2'
                            color={"text.secondary"}
                            sx={{ textAlign: "center", fontSize: ".8rem" }}>
                            Regular Season
                          </Typography>
                          <Divider sx={{ my: 0.5 }} />
                        </>
                      )}
                      <Fade in={true} timeout={800}>
                        <Stack direction={"row"}>
                          <Stack
                            direction='column'
                            divider={<Divider />}
                            spacing={1}
                            sx={{
                              justifyContent: "center",
                              alignItems: "left",
                              ml: { xs: 4, md: 1 },
                            }}>
                            {game.away_info.WL === null && (
                              <Tooltip title="Game in Progress. Highlights aren't available until ~20 minutes after game finish">
                                <InfoIcon
                                  color='error'
                                  sx={{ height: "20px" }}
                                />
                              </Tooltip>
                            )}

                            <Avatar
                              sx={{ width: 50, height: 50 }}
                              src={
                                "https://cdn.nba.com/logos/nba/" +
                                game.away_info.TEAM_ID +
                                "/primary/L/logo.svg"
                              }></Avatar>

                            <Avatar
                              sx={{ width: 50, height: 50 }}
                              src={
                                "https://cdn.nba.com/logos/nba/" +
                                game.home_info.TEAM_ID +
                                "/primary/L/logo.svg"
                              }></Avatar>
                          </Stack>
                          <Divider />
                          <Stack direction='column' spacing={3} ml={1}>
                            <Stack
                              direction={"column"}
                              sx={{ textAlign: "left", fontFamily: "Roboto" }}>
                              <Typography variant='body1'>
                                {game.away_info.TEAM_ABBREVIATION}
                              </Typography>

                              <Typography
                                variant='body2'
                                color={
                                  game.away_info.PTS > game.home_info.PTS
                                    ? "#6fbf73"
                                    : "#ffa199"
                                }>
                                {game.away_info.PTS}
                              </Typography>
                            </Stack>

                            <Stack
                              direction={"column"}
                              sx={{ textAlign: "left", fontFamily: "Roboto" }}>
                              <Typography variant='body1'>
                                {game.home_info.TEAM_ABBREVIATION}
                              </Typography>

                              <Typography
                                variant='body2'
                                color={
                                  game.home_info.PTS > game.away_info.PTS
                                    ? "#6fbf73"
                                    : "#ffa199"
                                }>
                                {game.home_info.PTS}
                              </Typography>
                            </Stack>
                          </Stack>

                          <Stack
                            direction={"column"}
                            ml={{ xs: "20%", md: "10%", lg: "20%" }}>
                            <Chip
                              size='small'
                              variant='outlined'
                              color='info'
                              label={game.away_info.MATCHUP}
                              sx={{ my: 1, mx: "auto", cursor: "pointer" }}
                            />
                            <Chip
                              size='small'
                              variant='outlined'
                              color='info'
                              label={game.date}
                              sx={{ my: 1, mx: "auto", cursor: "pointer" }}
                            />
                            <Chip
                              size='small'
                              variant={"filled"}
                              color='info'
                              icon={<VisibilityIcon />}
                              label={game.views}
                              sx={{ my: 1, mx: "auto", cursor: "pointer" }}
                            />
                          </Stack>
                        </Stack>
                      </Fade>
                    </Paper>
                  </Fade>
                </Link>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      ))}
    </>
  );
}
