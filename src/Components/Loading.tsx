import BeeIcon from "@mui/icons-material/EmojiNature"; // Exempel på bi-ikon från Material UI
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingIndicator() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Bi-ikon */}
      <Box
        sx={{
          animation: "buzz 1.5s infinite", // Animera ikonen
          fontSize: "4rem",
          color: "#FFA500",
          marginBottom: "1rem",
        }}
      >
        <BeeIcon fontSize="inherit" />
      </Box>

      {/* Laddningstext */}
      <Typography
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        Laddar profil...
      </Typography>

      {/* Spinner */}
      <CircularProgress
        sx={{
          marginTop: "1rem",
          color: "#FFA500",
        }}
      />
    </Box>
  );
}
