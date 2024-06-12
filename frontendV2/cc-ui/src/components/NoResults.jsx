import { Alert, Button, Stack, Paper, Typography } from "@mui/material";
import { Image } from "mui-image";
import muto from "../static/muto.gif";
import { clearPlayerFilters } from "../pages/players/playerSlice";
import { useDispatch } from "react-redux";
export default function NoResults(props) {
  const dispatch = useDispatch();
  return (
    <Paper variant='outlined' sx={{ borderRadius: 2, m: 2, borderWidth: 3 }}>
      <Stack spacing={2} mb={1}>
        <Image src={muto} fit='contain' />
        <Alert severity='warning' sx={{ justifyContent: "center" }}>
          No Results found
        </Alert>

        {props.isFromPlayer && (
          <Button onClick={() => dispatch(clearPlayerFilters())}>
            Clear Search Filters
          </Button>
        )}

        {props.isFromDate && (
          <Typography
            variant='body2'
            sx={{ textAlign: "center", color: "text.secondary" }}>
            Games Today don't show up until they are in progress or finished!
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
