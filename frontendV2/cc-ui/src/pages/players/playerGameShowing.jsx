import * as React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Hidden,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import { useSelector } from "react-redux";

export default function PlayerGameShowing(props) {
  const { gameShowing } = useSelector((state) => state.player);
  return (
    <>
      <Hidden smDown>
        <Paper
          variant='outlined'
          sx={{
            borderColor: "#90caf9",
            padding: 1,
            mt: 1,
          }}>
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}>
            <VisibilityIcon sx={{ color: "#90caf9" }} />
            <Typography variant='subtitle2' color={"#90caf9"}>
              Game Currently Viewing
            </Typography>
          </Stack>
        </Paper>
        <Paper
          variant='outlined'
          sx={{
            borderRadius: 2,
            padding: 0.5,
          }}>
          <Stack direction={"row"} justifyContent={"center"}>
            <Divider />
            <Stack
              direction={"row"}
              spacing={1}
              justifyContent={"left"}
              alignItems={"center"}>
              <Chip
                size='small'
                color='default'
                variant='outlined'
                label={gameShowing.date}
              />
              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  gameShowing.atid +
                  "/primary/L/logo.svg"
                }
              />
              <Typography variant='subtitle2'>
                {gameShowing.matchupstr}
              </Typography>

              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  gameShowing.htid +
                  "/primary/L/logo.svg"
                }
              />
            </Stack>
            <Stack>
              <Divider sx={{ ml: 1 }} orientation='vertical' />
            </Stack>

            <Stack direction={"row"} alignItems={"center"} ml={1} spacing={1}>
              <Chip
                icon={
                  <Tooltip
                    placement='top'
                    color='warning'
                    title='Not 100% accurate, FTs after last FGM not counted'>
                    <InfoIcon />
                  </Tooltip>
                }
                label={gameShowing.playerpts + " PTS"}
                sx={{
                  mx: "auto",
                }}
              />
              <Chip
                size='small'
                label={gameShowing.ast_count + " AST"}
                sx={{ mx: "auto" }}
              />
              <Chip
                size='small'
                label={gameShowing.blk_count + " BLK"}
                sx={{ mx: "auto" }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Hidden>

      {/* --------------------------------------------------------------- */}

      {/* Mobile view */}

      <Hidden smUp>
        <Paper
          variant='outlined'
          sx={{
            borderColor: "#90caf9",
            padding: 1,
            mt: 1,
          }}>
          <Stack
            direction={"row"}
            spacing={1}
            justifyContent={"center"}
            alignItems={"center"}>
            <VisibilityIcon sx={{ color: "#90caf9" }} />
            <Typography variant='subtitle2' color={"#90caf9"}>
              Game Currently Viewing
            </Typography>
          </Stack>
        </Paper>
        <Paper
          variant='outlined'
          sx={{
            borderRadius: 2,
            padding: 0.5,
          }}>
          <Stack direction={"row"} justifyContent={"center"}>
            <Divider />
            <Stack
              direction={"column"}
              spacing={0}
              justifyContent={"left"}
              alignItems={"center"}>
              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  gameShowing.atid +
                  "/primary/L/logo.svg"
                }
              />

              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  gameShowing.htid +
                  "/primary/L/logo.svg"
                }
              />
            </Stack>

            <Stack my={"auto"}>
              <Typography mx={1} textAlign={"center"} variant='caption'>
                {gameShowing.matchupstr}
              </Typography>

              <Typography
                textAlign={"center"}
                variant='caption'
                color={"text.secondary"}>
                {gameShowing.apts + "-" + gameShowing.hpts}
              </Typography>
            </Stack>
            <Stack>
              <Divider sx={{ ml: 1 }} orientation='vertical' />
            </Stack>

            <Stack direction={"row"} alignItems={"center"} ml={1} spacing={1}>
              <Chip
                icon={
                  <Tooltip
                    placement='top'
                    color='warning'
                    title='Not 100% accurate, FTs after last FGM not counted'>
                    <InfoIcon />
                  </Tooltip>
                }
                label={gameShowing.playerpts + " PTS"}
                sx={{
                  mx: "auto",
                }}
              />
              <Chip
                size='small'
                label={gameShowing.ast_count + " AST"}
                sx={{ mx: "auto" }}
              />
              <Chip
                size='small'
                label={gameShowing.blk_count + " BLK"}
                sx={{ mx: "auto" }}
              />
            </Stack>
          </Stack>
        </Paper>
      </Hidden>
    </>
  );
}
