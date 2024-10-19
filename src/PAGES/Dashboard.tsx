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
import { useNavigate } from "react-router-dom"; // Använd useNavigate för navigation
import { useAppSelector } from "../SLICES/store";
import ChatComponent from "../Components/chatComponent";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // Lägg till navigate för att hantera routing
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
        backgroundColor: "#f7f7f7", // Ljus bakgrundsfärg
      }}
    >
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
        Välkommen tillbaka {user?.username}!
      </Typography>

      {/* Huvudknapp för att lägga till ny annons */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FFA500", // Gul/orange från ditt färgschema
          color: "#FFF",
          padding: "0.75rem 1.5rem",
          fontSize: isMobile ? "1rem" : "1.2rem",
          "&:hover": {
            backgroundColor: "#cc8500", // Mörkare gul/orange
          },
        }}
        onClick={() => {
          navigate("/newad"); // Navigera till sidan för att lägga till annons
        }}
      >
        Lägg till ny annons
      </Button>

      {/* Ny knapp för allmän chatt */}
      <Button
        variant="outlined"
        sx={{
          marginTop: "1rem",
          borderColor: "#FFA500", // Gul/orange ram
          color: "#FFA500", // Textfärg
          padding: "0.75rem 1.5rem",
          fontSize: isMobile ? "1rem" : "1.2rem",
          "&:hover": {
            borderColor: "#cc8500", // Mörkare gul/orange vid hover
            color: "#cc8500",
          },
        }}
        onClick={() => {
          navigate("/chat"); // Navigera till chattsidan
        }}
      >
        Gå till allmän chatt
      </Button>

      {/* Annons-sektion */}
      <Typography variant="h5" sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
        Annonser i ditt område
      </Typography>

      <Grid container spacing={2}>
        {/* Exempel på en annons (kan vara flera kort i en grid layout) */}
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

        {/* Flera annonser kan läggas till i samma grid */}
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
          <ChatComponent />
        </Grid>
      </Grid>

      {/* <Grid item xs={12} sm={8}>
  <Box sx={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc" }}>
    {onmessage.map((message: { id: React.Key | null | undefined; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; timestamp: { seconds: number; }; userId: string; }) => (
      <Box key={message.id} sx={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
        <Typography variant="body1">
          <strong>{message.username}</strong>: {message.text}
        </Typography>
        <Typography variant="caption">{new Date(message.timestamp?.seconds * 1000).toLocaleString()}</Typography>
        {/* Lägg till knappar för redigera och ta bort om användaren äger meddelandet */}
  

      {/* Sektion för tips och råd
      <Typography variant="h5" sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
        Nyheter & Tips för biodlare
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Hur du startar med biodling
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En guide för nybörjare
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Läs mer
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Fler artiklar eller tips */}
      {/* <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Viktiga faktorer för biodlare
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vad du bör tänka på för att lyckas med biodlingen
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" sx={{ color: "#FFA500" }}>
                Läs mer
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default DashboardPage;
