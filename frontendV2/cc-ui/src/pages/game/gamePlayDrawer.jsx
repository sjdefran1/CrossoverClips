import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useDispatch, useSelector } from "react-redux";
import Play from "../../components/play";
import {
  Avatar,
  Chip,
  Stack,
  Typography,
  IconButton,
  ListItemSecondaryAction,
  Paper,
  Accordion,
  AccordionDetails,
  Fab,
  AccordionSummary,
  Snackbar,
} from "@mui/material";
import { setGamePlayIndex } from "./gameSlice";
import { enableVideoPlayer, handleQuarterChange } from "./gameSlice";
import GameStatFilter from "./gameStatFilters";
import DrawerStatSelect from "./gameStatSelectDrawer";
import PlayerFilter from "./playerFilter";

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const {
    allPlaysSorted,
    currentlyRenderedPlays,
    quarterSelected,
    currentPlayIndex,
  } = useSelector((state) => state.game);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const dispatch = useDispatch();

  const QuarterSelect = (
    <Paper elevation={1} sx={{ borderRadius: 0 }}>
      <Stack direction='row' justifyContent={"center"} alignItems='center'>
        <IconButton onClick={() => dispatch(handleQuarterChange(0))}>
          <KeyboardArrowLeftIcon color='info' />
        </IconButton>
        <Chip
          variant='outlined'
          label={"Quarter: " + quarterSelected}
          color='info'
        />
        <IconButton onClick={() => dispatch(handleQuarterChange(1))}>
          <KeyboardArrowRightIcon color='info' />
        </IconButton>
      </Stack>
    </Paper>
  );

  const DrawerList = (
    <>
      <Box
        sx={{ width: "30vw" }}
        role='presentation'
        // onClick={toggleDrawer(false)}
      >
        {QuarterSelect}

        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls='panel1-content'
            id='panel1-header'>
            <Typography>Player Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PlayerFilter />
          </AccordionDetails>
        </Accordion>
        <DrawerStatSelect />
        <List disablePadding>
          {currentlyRenderedPlays
            // .filter((play) => play.quarter === quarterSelected)
            .map((play, index) => (
              <Paper
                sx={{ borderRadius: 0 }}
                elevation={index === currentPlayIndex ? 10 : 0}>
                <ListItem disablePadding>
                  <ListItemButton
                    disableTouchRipple
                    disableRipple
                    onClick={() => {
                      dispatch(setGamePlayIndex(index));
                      toggleDrawer(false);
                    }}>
                    {/* <Stack direction={"row"} alignItems={"center"} spacing={1}> */}
                    <ListItemIcon>
                      <Avatar
                        src={
                          "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
                          play.playerID +
                          ".png"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <Stack direction={"column"} spacing={0.5}>
                        <Typography variant='body1'>{play.pname}</Typography>

                        <Divider sx={{ width: "50%" }} />
                        <Typography variant='body2' color={"text.secondary"}>
                          {play.description}
                        </Typography>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}>
                          <Chip sx={{ mt: 0.5 }} label={play.ptype} />

                          <Typography variant='body2' color={"text.secondary"}>
                            {play.time}
                          </Typography>
                          <Avatar
                            src={
                              "https://cdn.nba.com/logos/nba/" +
                              play.teamID +
                              "/primary/L/logo.svg"
                            }
                            sx={{ height: 20, width: 20 }}
                          />
                        </Stack>
                      </Stack>
                    </ListItemText>

                    {index === currentPlayIndex && <VisibilityIcon />}
                  </ListItemButton>
                </ListItem>
              </Paper>
            ))}
        </List>
        <Divider />
      </Box>
    </>
  );

  return (
    <>
      <Box width='100%' textAlign={"center"}>
        {!open && (
          <Snackbar
            open={true}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
            <Button
              variant='contained'
              color='info'
              sx={{ mt: 2 }}
              startIcon={<FormatListBulletedIcon />}
              onClick={toggleDrawer(true)}>
              Show PlayList
            </Button>
          </Snackbar>
        )}
        <Drawer anchor='right' open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </Box>
    </>
  );
}
