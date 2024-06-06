import { Stack, Avatar, FormControlLabel, Checkbox } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { handlePlayerSelect } from "./gameSlice";

export default function PlayerOptionList({ player }) {
  const dispatch = useDispatch();
  const selectedPlayers = useSelector((state) => state.game.filteredPlayers);

  return (
    <Stack direction='row' spacing={{ xs: -1, md: 1 }}>
      <Avatar
        src={
          "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" +
          player[2] +
          ".png"
        }
        sx={{
          width: 40,
          height: 40,
          ml: { xs: 0, md: 1 },
        }}
      />
      <FormControlLabel
        key={player[2]}
        label={player[1]}
        sx={{ ml: 1 }}
        control={
          <Checkbox
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon color='success' />}
            checked={selectedPlayers.includes(player[2])}
            onChange={() => dispatch(handlePlayerSelect(player[2]))}
          />
        }
      />
    </Stack>
  );
}
