import ChatIcon from "@mui/icons-material/Chat";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../SLICES/store";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "1rem" : "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
        Välkommen tillbaka {user?.username}!
      </Typography>

      {/* Huvudknapp för att lägga till ny annons */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FFA500",
          color: "#FFF",
          padding: "0.75rem 1.5rem",
          fontSize: isMobile ? "1rem" : "1.2rem",
          "&:hover": {
            backgroundColor: "#cc8500",
          },
        }}
        onClick={() => {
          navigate("/newad");
        }}
      >
        Lägg till ny annons
      </Button>

      {/* Ny knapp för att visa alla annonser */}
      <Button
        variant="outlined"
        sx={{
          marginTop: "1rem",
          borderColor: "#FFA500",
          color: "#FFA500",
          padding: "0.75rem 1.5rem",
          fontSize: isMobile ? "1rem" : "1.2rem",
          "&:hover": {
            borderColor: "#cc8500",
            color: "#cc8500",
          },
        }}
        onClick={() => {
          navigate("/adlist");
        }}
      >
        Visa alla annonser
      </Button>

      {/* Ny knapp för att visa alla chattar */}
      <Button
        variant="outlined"
        sx={{
          marginTop: "1rem",
          borderColor: "#FFA500",
          color: "#FFA500",
          padding: "0.75rem 1.5rem",
          gap: 1,
          fontSize: isMobile ? "1rem" : "1.2rem",
          "&:hover": {
            borderColor: "#cc8500",
            color: "#cc8500",
          },
        }}
        onClick={() => {
          navigate("/chatlist");
        }}
      >
        Visa alla chattar
        <ChatIcon />
      </Button>

      {/* Exempel på några annonser som visas i dashboarden */}
      <Typography variant="h5" sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
        Annonser i ditt område
      </Typography>

      <Grid container spacing={2}>
        {/* Exempel på en annons */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Biodlare söker mark i Skåne
              </Typography>
              <Typography sx={{ marginBottom: "1rem", color: "#777" }}>
                10 bikupor tillgängliga
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plats: Lund, Skåne
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Läs mer
              </Button>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Kontakta
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* En annan annons */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Markägare söker bikupor för pollinering
              </Typography>
              <Typography sx={{ marginBottom: "1rem", color: "#777" }}>
                Plats: Halmstad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                20 hektar mark tillgänglig
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Läs mer
              </Button>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Kontakta
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
