import {
  Box,
  Button,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Rubrik = styled(Typography)`
  font-family: "TAN", sans-serif;
  font-variation-settings: "wght" 300;
`;

export const Text = styled(Typography)`
  font-family: "POPPINS", sans-serif;
  font-variation-settings: "wght" 300;
`;

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
      <Rubrik
        variant={isMobile ? "h4" : "h2"}
        sx={{
          fontWeight: "bold",
          color: "#FFA500",
          marginBottom: "1rem",
        }}
      >
        Välkommen till Bikupetjänsten!
      </Rubrik>

      {/* Beskrivning av vad tjänsten gör */}
      <Text
        variant={isMobile ? "body1" : "h5"}
        sx={{
          maxWidth: "600px",
          marginBottom: "2rem",
          lineHeight: "1.5",
        }}
      >
        Vi kopplar samman biodlare och markägare för att hjälpa till med
        pollinering och placering av bikupor. Registrera dig för att komma åt
        annonser och börja nätverka!
      </Text>

      {/* Registrerings- och inloggningsknappar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        {/* Registreringsknapp */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FFA500",
            color: "#FFF",
            padding: isMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            "&:hover": {
              backgroundColor: "#cc8500",
            },
          }}
          onClick={() => {
            navigate("/register");
          }}
        >
          Registrera dig nu
        </Button>

        {/* Logga in-knapp */}
        <Button
          variant="outlined"
          sx={{
            borderColor: "#FFA500", // Gul/orange ram
            color: "#FFA500", // Textfärg
            padding: isMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            "&:hover": {
              borderColor: "#cc8500", // Mörkare gul/orange vid hover
              color: "#cc8500",
            },
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Logga in
        </Button>
      </Box>
    </Box>
  );
};

export default IndexPage;
