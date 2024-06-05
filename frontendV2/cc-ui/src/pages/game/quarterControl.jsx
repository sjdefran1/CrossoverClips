import React from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Switch,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { useSelector, useDispatch } from "react-redux";
import { enableVideoPlayer, handleQuarterChange } from "./gameSlice";
import OndemandVideo from "@mui/icons-material/OndemandVideo";

export default function QuarterControl() {
  const currentQuarter = useSelector((state) => state.game.quarterSelected);
  const dispatch = useDispatch();

  return (
    <AppBar position='static' sx={{ borderRadius: 1 }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Stack
          direction='row'
          alignItems={"center"}

          // textAlign={"center"}
          // sx={{ mr: { xs: "20%", md: "36%" } }}
        >
          <IconButton onClick={() => dispatch(handleQuarterChange(0))}>
            <KeyboardArrowLeftIcon color='info' />
          </IconButton>
          <Typography variant='body1' color='text.secondary'></Typography>
          <Chip
            variant='outlined'
            label={"Quarter: " + currentQuarter}
            color='info'
          />
          <IconButton onClick={() => dispatch(handleQuarterChange(1))}>
            <KeyboardArrowRightIcon color='info' />
          </IconButton>
          <Switch onClick={() => dispatch(enableVideoPlayer())} />
          <OndemandVideo />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
