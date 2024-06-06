import { Container } from "@mui/material";
import { useRouteError } from "react-router-dom";
import NoResults from "../components/NoResults";

export default function ErrorPage() {
  const error = useRouteError();
  // console.error(error);

  return (
    <div id='error-page'>
      <Container>
        <p>
          {" "}
          Sorry an unexpected error has occured! Please try refreshing you page.
          If this continues to happen consider shooting me an email{" "}
        </p>
      </Container>
    </div>
  );
}
