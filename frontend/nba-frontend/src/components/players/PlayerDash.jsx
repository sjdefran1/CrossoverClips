import * as React from "react";
import {
  Paper,
  Grid,
  Stack,
  Box,
  Badge,
  Avatar,
  Typography,
  Chip,
  Container,
  Tooltip,
  TextField,
  Alert,
  FormControl,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  LinearProgress,
  Divider,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import NbaHeader from "../NbaHeader.jsx";
import NbaFooter from "../NbaFooter";
import GoatAvatar from "../../static/goat.png";
import { styled } from "@mui/material/styles";

import { plays, teams } from "./plays.jsx";
import PlayersPlayList from "../PlaysList/PlayersPlayList.jsx";
import GameTypeSelect from "../ByTeamDash/GameTypeSelect.jsx";

import TeamLabel from "../ByTeamDash/TeamLabel.jsx";
import SeasonsSelect from "../ByTeamDash/SeasonsSelect.jsx";
import StatFilter from "../GameDetails/StatFilters.jsx";
import QuarterFilter from "./QuarterFilter2.jsx";

export default function PlayerDash(props) {
  const [seasonsSelected, setSeasonsSelected] = React.useState([]);
  const [gameType, setGameType] = React.useState([]);
  const [playArr, setPlayArr] = React.useState(plays);
  const [videoPlayerIndex, setVideoPlayerIndex] = React.useState(0);
  const [showProgressBar, setShowProgressBar] = React.useState(null);
  const [currentUrl, setCurrentUrl] = React.useState(playArr.plays[0].url);
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
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

  const MyChip = (props) => {
    return (
      <Chip
        label={props.label}
        onDelete={() => null}
        variant='outlined'
        sx={{ mr: 0.5, my: 0.1 }}
        avatar={
          <Avatar
            src={
              "https://cdn.nba.com/logos/nba/" +
              props.id +
              "/primary/L/logo.svg"
            }
          />
        }
      />
    );
  };

  React.useEffect(() => {
    // Whenever playArr changes, update the iframe URL
    // Make sure to handle any necessary checks and asynchronous operations here
    const iframe = document.getElementById("videoIframe");
    // if (iframe) {
    //   iframe.src = playArr.plays[0].url;
    // }
  }, [playArr]);

  const handleLeftArrowClick = () => {
    let playArrCopy = [...playArr.plays];
    let play = playArrCopy.pop();
    playArrCopy.unshift(play);
    setPlayArr({ plays: playArrCopy });
    setCurrentUrl(playArrCopy[0].url);
    setShowProgressBar(true);
  };

  const handleRightArrowClick = () => {
    let playArrCopy = [...playArr.plays];
    let play = playArrCopy.shift();
    playArrCopy.push(play);
    setPlayArr({ plays: playArrCopy });
    setCurrentUrl(playArrCopy[0].url);
    setShowProgressBar(true);
  };

  const setGameTypeFunc = (gameTypeArr) => {
    if (gameTypeArr[0] === true && gameTypeArr[1] === true) {
      setGameType("");
    }
    if (gameTypeArr[0] === false) {
      setGameType("playoffs");
    }
    if (gameTypeArr[1] === false) {
      setGameType("regular season");
    }
  };
  // console.log(showProgressBar);
  return (
    <>
      <Paper
        sx={
          {
            // background: "#1b1b1b",
            //   "radial-gradient(circle, hsla(0, 0%, 22%, 1) 0%, hsla(0, 100%, 13%, 1) 25%, hsla(216, 53%, 12%, 1) 57%, hsla(0, 0%, 11%, 1) 84%)",
            // backgroundSize: "110% 110%",
            // animation: `${gradient} 4s infinite alternate`,
          }
        }>
        <NbaHeader small={true} />
      </Paper>
      <Container maxWidth={"xl"}>
        <Grid container>
          {/* Player Dash, logo name etc */}
          <Grid item xs={5.5} sx={{ my: 1, ml: 5 }}>
            <Paper sx={{ borderRadius: 2 }}>
              <Stack direction={"row"} alignItems={"center"} spacing={3} ml={5}>
                {/* StyledBadge provides the little green/red circle
                    Indicating if Active/inactive */}
                <StyledBadge
                  overlap='circular'
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  variant='dot'
                  sx={{ mb: 1 }}>
                  <Avatar
                    src='https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png'
                    sx={{
                      height: 185,
                      width: 185,
                    }}
                  />
                </StyledBadge>
                <div>
                  <Divider orientation='vertical' />
                </div>

                <Stack direction={"column"} spacing={0.5}>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Typography variant='h4'>Lebron James</Typography>
                    <Avatar
                      src={
                        "https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg"
                      }
                    />
                  </Stack>

                  <Typography variant='body1' color='text.secondary'>
                    Forward #6
                  </Typography>
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Chip color='success' label={"Active"} />

                    <Chip label="20 SZN's" color='info' />
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
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
            {/* Find plays against matchup autocomplete */}
            <Paper sx={{ mt: 1 }}>
              <Autocomplete
                multiple
                autoHighlight
                clearOnEscape
                autoComplete={true}
                id='combo-box-demo'
                options={teams}
                getOptionLabel={(option) => option?.full_name}
                sx={{ width: "90%", padding: 1 }}
                size='small'
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option) => (
                    <MyChip label={option.full_name} id={option.id} />
                  ));
                }}
                onChange={(event, newValue) => {
                  //   let newId = newValue[newValue.length - 1];
                  //   handleTeamSelect(newId?.team_id);
                  //   console.log("newVal");
                  //   console.log(newValue);
                  //   // if (teamNameCompleteList.length === 0) {
                  //   //   setTeamNameCompleteList(newId?.label);
                  //   // }
                  //   // console.log(newId);
                  //   // setValue(newValue.team_id);
                }}
                renderOption={(props, option) => (
                  <Box component='li' {...props} key={option.id}>
                    <TeamLabel team_id={option?.id} name={option?.full_name} />
                  </Box>
                )}
                renderInput={(params) => (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <SearchIcon />
                    <TextField
                      {...params}
                      label='Find Plays Against These Teams'
                    />
                  </Stack>
                )}
              />

              {/* Find plays while player was on this team
                auto complete */}
              <Autocomplete
                multiple
                autoHighlight
                clearOnEscape
                autoComplete={true}
                id='combo-box-demo'
                options={teams}
                getOptionLabel={(option) => option?.full_name}
                sx={{ width: "90%", padding: 1 }}
                size='small'
                renderTags={(tagValue, getTagProps) => {
                  return tagValue.map((option) => (
                    <MyChip label={option.full_name} id={option.id} />
                  ));
                }}
                onChange={(event, newValue) => {
                  //   let newId = newValue[newValue.length - 1];
                  //   handleTeamSelect(newId?.team_id);
                  //   console.log("newVal");
                  //   console.log(newValue);
                  //   // if (teamNameCompleteList.length === 0) {
                  //   //   setTeamNameCompleteList(newId?.label);
                  //   // }
                  //   // console.log(newId);
                  //   // setValue(newValue.team_id);
                }}
                renderOption={(props, option) => (
                  <Box component='li' {...props} key={option.id}>
                    <TeamLabel team_id={option?.id} name={option?.full_name} />
                  </Box>
                )}
                renderInput={(params) => (
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <SearchIcon />
                    <TextField
                      {...params}
                      label='Find Plays When Player Was On These Teams'
                    />
                  </Stack>
                )}
              />
            </Paper>

            {/* Filter By Season */}
            <Paper sx={{ mt: 1 }}>
              <Paper
                // elevation={15}
                variant='outlined'
                sx={{ textAlign: "center", bgcolor: "#333" }}>
                <Chip
                  variant='outlined'
                  label='Choose Seasons'
                  sx={{ my: 0.5 }}
                />
              </Paper>
              <Alert severity='info' sx={{ justifyContent: "center" }}>
                All seasons returned by default
              </Alert>

              <Box padding={1} textAlign={"center"}>
                <SeasonsSelect
                  showAlert={false}
                  seasonsSelected={seasonsSelected}
                  setSeasonsSelected={setSeasonsSelected}
                />
              </Box>
            </Paper>

            {/* Filter By GameType */}
            <Paper sx={{ mt: 1 }}>
              <Paper
                // elevation={15}
                variant='outlined'
                sx={{ textAlign: "center", bgcolor: "#333" }}>
                <Chip variant='outlined' label='Game Type' sx={{ my: 0.5 }} />
              </Paper>
              <Stack
                direction={"row"}
                spacing={2}
                ml={"21.5%"}
                divider={
                  <div>
                    <Divider orientation='vertical' />
                  </div>
                }>
                <Stack direction={"row"}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CircleOutlined />}
                        checkedIcon={<CircleIcon color='success' />}
                      />
                    }
                    label='Home'
                    icon={<CircleOutlined />}
                    checkedIcon={<CircleIcon color='success' />}
                    checked={true}
                    // onClick={() => handleChange(0)}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        icon={<CircleOutlined />}
                        checkedIcon={<CircleIcon color='success' />}
                      />
                    }
                    label='Away'
                    checked={true}
                    // onClick={() => handleChange(1)}
                  />
                </Stack>
                <GameTypeSelect setGameType={setGameTypeFunc} />
              </Stack>
            </Paper>

            <Box my={1} textAlign={"center"}>
              <Divider />
              <Chip
                label='In Game Options'
                variant='outlined'
                sx={{ my: 1 }}
                color='info'
              />
              <Divider />
            </Box>

            <Grid container xs={12} mt={1}>
              <Grid item xs={6}>
                <StatFilter />
              </Grid>
              <Grid item xs={5.8}>
                {/* <QuarterFilter /> */}
                <Paper>
                  <Paper
                    variant='outlined'
                    sx={{ textAlign: "center", bgcolor: "#333" }}>
                    <Chip label='Quarter' variant='outlined' sx={{ my: 0.5 }} />
                  </Paper>

                  <Stack
                    direction={"row"}
                    justifyContent={"center"}
                    spacing={1}
                    padding={1}
                    my={1}>
                    <Chip
                      label={1}
                      sx={{ height: 45, width: 45, borderRadius: "50%" }}
                    />
                    <Chip
                      label={2}
                      sx={{ height: 45, width: 45, borderRadius: "50%" }}
                    />
                    <Chip
                      label={3}
                      sx={{ height: 45, width: 45, borderRadius: "50%" }}
                    />
                    <Chip
                      label={4}
                      color='success'
                      sx={{ height: 45, width: 45, borderRadius: "50%" }}
                    />
                    <Chip
                      label={"OT"}
                      color='success'
                      sx={{ height: 45, width: 45, borderRadius: "50%" }}
                    />
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* spacer between two grid items */}
          {/* <Grid item xs={1}></Grid> */}

          {/* Video preview
              Plays List */}
          <Grid item xs={6} ml={1}>
            {/* <Box padding={1} mx={5} minHeight={"40vh"}> */}
            <Paper
              variant='outlined'
              sx={{ textAlign: "center", bgcolor: "#333" }}>
              <Stack
                direction='row'
                justifyContent={"center"}
                spacing={1}
                alignItems={"center"}>
                <Chip
                  label={playArr.plays[0].ptype}
                  variant='outlined'
                  color='primary'
                  sx={{ my: 0.5 }}
                />
                <Chip
                  label={playArr.plays[0].matchupstr}
                  variant='outlined'
                  color='info'
                  sx={{ my: 0.5 }}
                />

                <Chip
                  label={playArr.plays[0].sznstr}
                  variant='outlined'
                  color='primary'
                  sx={{ my: 0.5 }}
                />
              </Stack>
            </Paper>
            {showProgressBar && <LinearProgress color='success' />}
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              ml={1}
              my={1}>
              <IconButton onClick={handleLeftArrowClick}>
                <KeyboardArrowLeftIcon fontSize='large' color='info' />
              </IconButton>

              <iframe
                id='videoIframe'
                width={!showProgressBar ? "640" : "0"}
                height={!showProgressBar ? "360" : "0"}
                // onLoadStart={() => setShowProgressBar(true)}
                // onLoad={() => setShowProgressBar(false)}
                onLoad={() => setShowProgressBar(false)}
                src={currentUrl}
                frameborder='0'
                allowFullScreen></iframe>

              {showProgressBar && (
                <Box minHeight={"47.5vh"} width={"100%"}></Box>
              )}
              <IconButton onClick={handleRightArrowClick}>
                <KeyboardArrowRightIcon fontSize='large' color='info' />
              </IconButton>
            </Stack>
            {/* </Box> */}

            <PlayersPlayList
              playByPlay={playArr}
              playInVideoPlayer={playArr.plays[0]}
              home_teamID={1610612738}
              away_teamID={1610612739}
            />
          </Grid>

          {/* end of whole grid */}
        </Grid>
      </Container>

      <NbaFooter />
    </>
  );
}
