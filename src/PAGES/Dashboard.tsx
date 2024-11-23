import ChatIcon from "@mui/icons-material/Chat";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../Components/chatComponent";
import { getAdsByLocationAsync, setSelectedAd } from "../SLICES/adSlice";
import { getAllChatsByProfileAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";
import { Rubrik, Text } from "./Index";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const adsByLocation = useAppSelector((state) => state.adSlice.adsByLocation);
  const chatSessions = useAppSelector((state) => state.chatSlice.chatSessions);
  const dispatch = useAppDispatch();
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user && user.shareLocation == true) {
      dispatch(getAdsByLocationAsync(user.city));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(getAllChatsByProfileAsync(user?.id));
    }
  }, [user]);

  useEffect(() => {
    if (chatSessions) {
      const unreadSessions = chatSessions.filter(
        (c) => c.hasUnreadMessages == true && c.latestSenderId != user?.id
      ).length;
      setUnreadMessages(unreadSessions);
    }
  }, [chatSessions]);

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
      <Rubrik variant={isMobile ? "h4" : "h3"} gutterBottom>
        Välkommen tillbaka, {user?.username}!
      </Rubrik>

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
          <Text>Lägg till ny annons</Text>
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
          <Text> Visa alla annonser</Text>
        </Button>

        <Badge
          badgeContent={unreadMessages}
          color="success"
          invisible={unreadMessages === 0}
        >
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
            <Text>Visa alla chattar</Text>
            <ChatIcon />
          </Button>
        </Badge>
      </Box>

      <Rubrik variant="h5" sx={{ marginBottom: "1rem" }}>
        Annonser i ditt område
      </Rubrik>

      <Grid container spacing={2} justifyContent="center">
        {adsByLocation && adsByLocation.length > 0 ? (
          adsByLocation.map((ad, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
                <CardContent>
                  <Text variant="h6">{ad.title}</Text>
                  {ad.numberOfHives && (
                    <Text sx={{ marginBottom: "1rem", color: "#777" }}>
                      {`${ad.numberOfHives} kupor tillgängliga`}
                    </Text>
                  )}
                  <Text variant="body2" color="text.secondary">
                    Plats: {ad.location || "Ingen plats angiven"}
                  </Text>
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
        ) : user?.shareLocation == false ? (
          <Text sx={{ color: "#777", marginTop: "1rem" }}>
            För att se annonser baserad på din plats, tillåt annonssökning
            baserad på stad på din profilsida.
          </Text>
        ) : (
          <Text sx={{ color: "#777", marginTop: "1rem" }}>
            Inga annonser tillgängliga i ditt område
          </Text>
        )}
      </Grid>

      <ChatComponent />
    </Box>
  );
};

export default DashboardPage;
