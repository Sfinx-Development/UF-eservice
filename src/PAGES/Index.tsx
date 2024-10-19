import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        color: "#FFF",
        textAlign: "center",
      }}
    >
      {/* Tjänstens rubrik */}
      <Typography
        variant={isMobile ? "h4" : "h2"} // Mindre rubrikstorlek för mobil
        sx={{
          fontWeight: "bold",
          color: "#FFA500", // Gul/orange från din logga
          marginBottom: "1rem",
        }}
      >
        Välkommen till Bikupetjänsten!
      </Typography>

      {/* Beskrivning av vad tjänsten gör */}
      <Typography
        variant={isMobile ? "body1" : "h5"} // Mindre textstorlek för mobil
        sx={{
          maxWidth: "600px",
          marginBottom: "2rem",
          lineHeight: "1.5",
        }}
      >
        Vi kopplar samman biodlare och markägare för att hjälpa till med
        pollinering och placering av bikupor. Registrera dig för att komma åt
        annonser och börja nätverka!
      </Typography>

      {/* Registreringsknapp */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FFA500", // Gul/orange
          color: "#FFF",
          padding: isMobile ? "0.5rem 1rem" : "0.75rem 1.5rem", // Anpassad knappstorlek för mobil
          fontSize: isMobile ? "1rem" : "1.2rem", // Mindre textstorlek på knappen för mobil
          "&:hover": {
            backgroundColor: "#cc8500", // Mörkare version av gul/orange
          },
        }}
        onClick={() => {
          navigate("/register");
        }}
      >
        Registrera dig nu
      </Button>
    </Box>
  );
};

export default IndexPage;
