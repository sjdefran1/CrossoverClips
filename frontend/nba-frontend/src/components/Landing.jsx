import { useNavigate } from "react-router-dom";
import * as React from "react";
import axios from "axios";
import { reqString } from "../App";

export default function Landing() {
  const navigate = useNavigate();

  const handleUserVisit = () => {
    axios.post(reqString + "players/registerOrUpdateViewer");
    navigate("/home");
  };

  React.useEffect(() => {
    handleUserVisit();
  }, []);

  return <></>;
}
