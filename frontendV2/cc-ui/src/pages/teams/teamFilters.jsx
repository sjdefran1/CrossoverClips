import Filter from "../../components/filter";
import { Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateTeamFilter } from "./teamSlice";
export default function TeamFilters() {
  const teamFilterOptions = useSelector((state) => state.teams.searchOptions);

  return (
    <>
      <Grid container spacing={2}>
        {Object.entries(teamFilterOptions).map(([category, dict]) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
            <Filter
              title={category}
              arrOfKeys={Object.keys(dict)}
              dict={dict}
              parentDispatchFunction={updateTeamFilter}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
