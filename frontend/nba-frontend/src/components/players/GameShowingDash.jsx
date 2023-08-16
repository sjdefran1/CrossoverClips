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
  Box,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";

export default function GameShowingDash(props) {
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
              {/* <Chip
              size='small'
              color='info'
              icon={<VisibilityIcon />}
              label={props.gameShowing[1].views}
            /> */}
              <Chip
                size='small'
                color='default'
                variant='outlined'
                label={props.gameShowing[1].date}
              />
              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  props.gameShowing[1].atid +
                  "/primary/L/logo.svg"
                }
              />
              <Typography variant='subtitle2'>
                {props.gameShowing[1].matchupstr}
              </Typography>

              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  props.gameShowing[1].htid +
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
                label={props.gameShowing[1].playerpts + " PTS"}
                sx={{
                  mx: "auto",
                }}
              />
              <Chip
                size='small'
                label={props.gameShowing[1].ast_count + " AST"}
                sx={{ mx: "auto" }}
              />
              <Chip
                size='small'
                label={props.gameShowing[1].blk_count + " BLK"}
                sx={{ mx: "auto" }}
              />
            </Stack>
          </Stack>
          {/* 
          <Stack>
            <Divider sx={{ ml: 1 }} orientation='vertical' />
          </Stack>
          <Stack>
            <Typography>Where</Typography>
          </Stack> */}
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
                  props.gameShowing[1].atid +
                  "/primary/L/logo.svg"
                }
              />

              <Avatar
                src={
                  "https://cdn.nba.com/logos/nba/" +
                  props.gameShowing[1].htid +
                  "/primary/L/logo.svg"
                }
              />
            </Stack>

            <Stack my={"auto"}>
              <Typography
                mx={1}
                // my={"auto"}
                textAlign={"center"}
                variant='caption'>
                {props.gameShowing[1].matchupstr}
              </Typography>

              <Typography
                //   mx={1}
                // my={"auto"}
                textAlign={"center"}
                variant='caption'
                color={"text.secondary"}>
                {props.gameShowing[1].apts + "-" + props.gameShowing[1].hpts}
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
                label={props.gameShowing[1].playerpts + " PTS"}
                sx={{
                  mx: "auto",
                }}
              />
              <Chip
                size='small'
                label={props.gameShowing[1].ast_count + " AST"}
                sx={{ mx: "auto" }}
              />
              <Chip
                size='small'
                label={props.gameShowing[1].blk_count + " BLK"}
                sx={{ mx: "auto" }}
              />
            </Stack>
          </Stack>
          {/* 
          <Stack>
            <Divider sx={{ ml: 1 }} orientation='vertical' />
          </Stack>
          <Stack>
            <Typography>Where</Typography>
          </Stack> */}
        </Paper>
      </Hidden>
    </>
  );
}
