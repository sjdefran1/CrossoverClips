import React from "react";
import {
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Typography,
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
  const dispatch = useDispatch();

  return (
    <AppBar position='static' sx={{ borderRadius: 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Stack direction='row' alignItems='center' spacing={1}>
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
        <Stack direction='row' alignItems='center' spacing={1}>
          <Switch onClick={() => dispatch(enableVideoPlayer())} />
          <OndemandVideo />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
