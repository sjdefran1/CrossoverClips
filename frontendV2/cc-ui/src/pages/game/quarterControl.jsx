import React from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Chip,
  Switch,
  Box,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import OndemandVideo from "@mui/icons-material/OndemandVideo";
import { useSelector, useDispatch } from "react-redux";
import { enableVideoPlayer, handleQuarterChange } from "./gameSlice";

export default function QuarterControl() {
  const currentQuarter = useSelector((state) => state.game.quarterSelected);
  const videoPlayerEnabled = useSelector(
    (state) => state.game.videoPlayerEnabled
  );
  const dispatch = useDispatch();

  return (
    <AppBar position='static' sx={{ borderRadius: 1 }}>
      <Toolbar sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}>
          <Stack direction='row' alignItems='center'>
            <IconButton onClick={() => dispatch(handleQuarterChange(0))}>
              <KeyboardArrowLeftIcon color='info' />
            </IconButton>
            <Chip
              variant='outlined'
              label={"Quarter: " + currentQuarter}
              color='info'
            />
            <IconButton onClick={() => dispatch(handleQuarterChange(1))}>
              <KeyboardArrowRightIcon color='info' />
            </IconButton>
          </Stack>
        </Box>
        <Box sx={{ marginLeft: "auto" }}>
          <Stack direction='row' alignItems='center' spacing={1}>
            <Switch
              checked={videoPlayerEnabled}
              onClick={() => dispatch(enableVideoPlayer())}
            />
            <OndemandVideo />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
