import * as React from "react";

import { Avatar, Chip, Collapse } from "@mui/material";

export const setDictFalse = (dict) => {
  let dictCopy = { ...dict };

  for (const key in dictCopy) {
    dictCopy[key] = false;
  }
  return dictCopy;
};

export const findTrueKeys = (dict) => {
  const trueKeys = [];

  for (const key in dict) {
    if (dict[key] === true) {
      trueKeys.push(key);
    }
  }

  // if all filters are selected
  // then that is the same as none being selected on the backend
  // will just not include and clause in sql query
  if (trueKeys.length === Object.keys(dict).length) return null;

  // if no options selected
  // return null to drop and clause
  if (trueKeys.length === 0) return null;

  return trueKeys;
};

// Styled chip for autocomplete tags
export const MyChip = (props) => {
  //   const [hidden, /setHidden] = React.useState(false);
  return (
    <Chip
      label={props.label}
      //   onDelete={() => setHidden(true)}
      variant='outlined'
      sx={{ mr: 0.5, my: 0.1 }}
      avatar={
        <Avatar
          src={
            "https://cdn.nba.com/logos/nba/" + props.id + "/primary/L/logo.svg"
          }
        />
      }
    />
  );
};
