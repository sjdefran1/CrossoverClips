import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChoosePlayer() {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate(`/players/2544`)}>Lebron</Button>
      <Button onClick={() => navigate(`/players/1628983`)}>Shai</Button>
      <Button onClick={() => navigate(`/players/1628369`)}>Tatum</Button>
    </>
  );
}
