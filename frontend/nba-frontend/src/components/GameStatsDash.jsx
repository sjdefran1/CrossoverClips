import * as React from "react";
import {
  Stack,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  Fade,
  FormGroup,
  FormControlLabel,
  Switch,
  Tooltip,
  Paper,
  Divider,
  Box,
} from "@mui/material";

//const project = projects[0];
export default function GameStatsDash(props) {
  return (
    <>
      <Paper>
        <Grid container>
          <Grid item xs={12} alignItems='center'>
            <Typography>{props.gameInfo.home_info.FGM}</Typography>
            <Divider inset sx={{ ml: "30%", mr: "30%" }}>
              <Chip
                label='Frame Works'
                variant='outlined'
                color='success'
                sx={{ textAlign: "center" }}
              />
            </Divider>
          </Grid>
          <Grid item xs={12}>
            <Typography>FGM</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>FG3A</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>FG3M</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>FTA</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>FTM</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>FT_PCT</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>REB</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>AST</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>STL</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>BLK</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>TOV</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
