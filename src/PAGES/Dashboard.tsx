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
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../Components/chatComponent";
import { getAdsByLocationAsync, setSelectedAd } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const adsByLocation = useAppSelector((state) => state.adSlice.adsByLocation);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getAdsByLocationAsync(user.city));
    }
  }, [user]);

  const handleNavigateToAd = (ad: Ad) => {
    dispatch(setSelectedAd(ad));
    navigate("/addetail");
  };

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
        Välkommen tillbaka, {user?.username}!
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          marginBottom: "2rem",
        }}
      >
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

        <Button
          variant="outlined"
          sx={{
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

        <Button
          variant="outlined"
          sx={{
            borderColor: "#FFA500",
            color: "#FFA500",
            padding: "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            gap: 1,
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
      </Box>

      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Annonser i ditt område
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {adsByLocation && adsByLocation.length > 0 ? (
          adsByLocation.map((ad, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {ad.title}
                  </Typography>
                  {ad.numberOfHives && (
                    <Typography sx={{ marginBottom: "1rem", color: "#777" }}>
                      {`${ad.numberOfHives} kupor tillgängliga`}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Plats: {ad.location || "Ingen plats angiven"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => handleNavigateToAd(ad)}
                    size="small"
                    sx={{ color: "#FFA500" }}
                  >
                    Läs mer
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ color: "#777", marginTop: "1rem" }}>
            Inga annonser tillgängliga i ditt område
          </Typography>
        )}
      </Grid>

      <ChatComponent />
    </Box>
  );
};

export default DashboardPage;
