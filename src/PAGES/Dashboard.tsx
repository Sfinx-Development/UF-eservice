import ChatIcon from "@mui/icons-material/Chat";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../Components/chatComponent";
import {
  addAdminChatAsync,
  getAdminChatSessionByProfileAsync,
} from "../SLICES/adminChatSlice";
import {
  getAdsByLocationAsync,
  getAllAdsAsync,
  setSelectedAd,
} from "../SLICES/adSlice";
import { getAllChatsByProfileAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad, AdminUserSession } from "../types";
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
    dispatch(getAllAdsAsync());
  }, []);

  useEffect(() => {
    if (user && user.shareLocation == true && user.location) {
      dispatch(getAdsByLocationAsync(user.location));
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

  const handleNavigateToSupportChat = async () => {
    if (!user) {
      console.error("User is not logged in.");
      return;
    }

    try {
      // Försök att hämta en befintlig chatt
      const resultAction = await dispatch(
        getAdminChatSessionByProfileAsync(user.id)
      );

      if (resultAction.meta.requestStatus === "fulfilled") {
        const chatSession = unwrapResult(resultAction) as AdminUserSession;
        navigate(`/support-chat/${chatSession.id}`);
      } else {
        // Om ingen chatt hittades, skapa en ny
        const newChatSession: AdminUserSession = {
          id: "undefined", // Skapas senare av backend/databas
          userId: user.id,
          userName: user.username,
          messages: [],
          lastMessage: "",
          lastUpdated: new Date().toISOString(),
        };

        const result = await dispatch(addAdminChatAsync(newChatSession));

        if (result.meta.requestStatus === "fulfilled") {
          const payload = result.payload as AdminUserSession;
          if (payload?.id) {
            navigate(`/support-chat/${payload.id}`);
          } else {
            console.error("Failed to get chat session ID from payload.");
          }
        } else {
          console.error("Failed to create a new chat session.");
        }
      }
    } catch (error) {
      console.error("Failed to handle chat navigation:", error);
    }
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
        // backgroundColor: "#fffaeb",
        background: "url(https://i.imgur.com/o6I6C94.png)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Rubrik
        variant={isMobile ? "h4" : "h3"}
        sx={{
          color: "#fffaeb",
          marginTop: { xl: -20 },
          marginBottom: 4,
          textAlign: "center",
          // backgroundColor: "rgba(81, 1, 2, 0.5)",
          // // message.senderId === user?.id ? "#E1FFC7" : "#FFF",
          // padding: "0.75rem",
          // borderRadius: "10px",
          fontWeight: 600,
        }}
        gutterBottom
      >
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
            backgroundColor: "#fffaeb",
            color: "#510102",
            // color: "#FFF",
            padding: "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            "&:hover": {
              borderColor: "#510102",
              color: "#510102",
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
            borderColor: "#fffaeb",
            backgroundColor: "rgba(81, 1, 2, 0.2)",
            color: "#510102",
            padding: "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
          }}
          onClick={() => {
            navigate("/adlist");
          }}
        >
          <Text sx={{ color: "#fffaeb" }}> Visa alla annonser</Text>
        </Button>

        <Badge
          badgeContent={unreadMessages}
          color="success"
          invisible={unreadMessages === 0}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: "#fffaeb",
              backgroundColor: "rgba(81, 1, 2, 0.2)",
              color: "#FFA500",
              padding: "0.75rem 1.5rem",
              fontSize: isMobile ? "1rem" : "1.2rem",
              gap: 1,
            }}
            onClick={() => {
              navigate("/chatlist");
            }}
          >
            <Text sx={{ color: "#fffaeb" }}>Visa alla chattar</Text>
            <ChatIcon sx={{ color: "#fffaeb" }} />
          </Button>
        </Badge>

        <Tooltip title="Chatta med admin här">
          <Button
            variant="outlined"
            sx={{
              borderColor: "#fffaeb",
              backgroundColor: "rgba(81, 1, 2, 0.2)",
              color: "#FFA500",
              padding: "0.75rem 1.5rem",
              fontSize: isMobile ? "1rem" : "1.2rem",
              gap: 1,
            }}
            onClick={() => {
              handleNavigateToSupportChat();
            }}
          >
            <HelpOutlineIcon sx={{ color: "#fffaeb" }} />
          </Button>
        </Tooltip>
      </Box>

      <Rubrik variant="h5" sx={{ marginBottom: "1rem", color: "#fffaeb" }}>
        Annonser i ditt område
      </Rubrik>

      <Grid container spacing={2} justifyContent="center">
        {adsByLocation && adsByLocation.length > 0 ? (
          adsByLocation.map((ad, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#fffaeb",
                  "&:hover": {
                    borderColor: "#510102",
                    color: "#510102",
                  },
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Rubrik variant="h6" sx={{ color: "#510102" }}>
                    {ad.title}
                  </Rubrik>
                  {ad.numberOfHives && (
                    <Text sx={{ marginBottom: "1rem", color: "#510102" }}>
                      {`${ad.numberOfHives} kupor tillgängliga`}
                    </Text>
                  )}
                  <Text variant="body2" sx={{ color: "#510102" }}>
                    Plats: {ad.cityName || "Ingen plats angiven"}
                  </Text>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => handleNavigateToAd(ad)}
                    size="small"
                    sx={{ color: "#510102", fontWeight: 600 }}
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
          <Text sx={{ color: "#fffaeb", marginTop: "1rem" }}>
            Inga annonser tillgängliga i ditt område
          </Text>
        )}
      </Grid>

      <ChatComponent />
    </Box>
  );
};

export default DashboardPage;
