import React from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

import { useSelector, useDispatch } from "react-redux";
import { handleQuarterChange } from "./gameSlice";

export default function QuarterControl() {
  const currentQuarter = useSelector((state) => state.game.quarterSelected);
  const dispatch = useDispatch();

  return (
    <AppBar position='static' sx={{ borderRadius: 1 }}>
      <Toolbar sx={{ justifyContent: "right" }}>
        <Stack
          direction='row'
          alignItems={"center"}
          sx={{ mr: { xs: "20%", md: "36%" } }}>
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
        </Stack>
        <Tooltip title='Click anywhere on a play to be redirected!'>
          <InfoIcon color='success' />
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
