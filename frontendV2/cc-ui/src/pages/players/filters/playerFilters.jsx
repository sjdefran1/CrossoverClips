import React from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterSnackBar from "./filterSnackbar";

export default function PlayerFilters() {
  const { currentPlayer } = useSelector((state) => state.player);
  const dispatch = useDispatch();

  return (
    <>
      {currentPlayer?.playerID && <FilterSnackBar />}

      <p>hello</p>
    </>
  );
}
