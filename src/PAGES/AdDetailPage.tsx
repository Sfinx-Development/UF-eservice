import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdAsync } from "../SLICES/adSlice";
import {
  addChatAsync,
  getAllChatsByProfileAsync,
  getChatByAdAndUserAsync,
} from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { AdChatSession } from "../types";

const AdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedAd = useAppSelector((state) => state.adSlice.selectedAd);
  const userProfile = useAppSelector((state) => state.userSlice.user); // Hämta inloggad användares profil
  const chatSessions = useAppSelector((state) => state.chatSlice.chatSessions);
  const [chatExists, setChatExists] = useState(false);
  const error = useAppSelector((state) => state.adSlice.error);
  const loading = useAppSelector((state) => state.adSlice.loading);

  useEffect(() => {
    if (id) {
      dispatch(getAdAsync(id)); // Hämta annonsen baserat på ID
      if (userProfile) {
        dispatch(getAllChatsByProfileAsync(userProfile.id)); // Hämta alla chatt-sessioner för användaren
      }
    }
  }, [dispatch, id, userProfile]);

  useEffect(() => {
    if (chatSessions && selectedAd) {
      // Kolla om en chatt-session redan finns mellan användaren och annonsören
      const existingChat = chatSessions.find(
        (chat) =>
          chat.adId === selectedAd.id && chat.senderId === userProfile?.id
      );
      if (existingChat) {
        setChatExists(true);
      }
    }
  }, [chatSessions, selectedAd, userProfile]);

  const handleNavigateToChat = async () => {
    if (!chatExists && selectedAd && userProfile) {
      // Skapa en ny chatt-session om det inte finns en redan
      const newChat = {
        id: "", // Fylls i av Firebase
        adId: selectedAd.id,
        adTitle: selectedAd.title,
        senderId: userProfile.id, // Inloggad användare
        senderName: userProfile.username,
        receiverId: selectedAd.profileId, // Annonsörens profil-ID
        receiverName: selectedAd.profileId, // Annonsörens namn
        messages: [],
        lastMessage: "",
        lastUpdated: new Date().toISOString(),
      };
      const result = await dispatch(addChatAsync(newChat));
      if (result.meta.requestStatus === "fulfilled") {
        const payload = result.payload as AdChatSession;
        if (payload && payload.id) {
          navigate(`/chat/${payload.id}`);
        }
      }
    } else if (selectedAd && userProfile) {
      const result = await dispatch(
        getChatByAdAndUserAsync({ adId: selectedAd.id, userId: userProfile.id })
      );
      if (result.meta.requestStatus === "fulfilled") {
        if (result.meta.requestStatus === "fulfilled") {
          const payload = result.payload as AdChatSession;
          if (payload && payload.id) {
            navigate(`/chat/${payload.id}`);
          }
        }
      }
    }
  };

  //SPARA TIL LOCALSTORAGE ALLA STATES!!!!
  //OM FORTFARANDE EJ FUNKAR - KOLLA OM ADID SPARAS ORDENRLIGT PÅ ADCHATSESSIONEN

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : selectedAd ? (
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel och plats */}
          <Grid item xs={12}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
              {selectedAd.title}
            </Typography>
            <Typography variant="h6" sx={{ color: "#777" }}>
              Plats: {selectedAd.location}
            </Typography>
          </Grid>

          {/* Huvudinnehåll */}
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {selectedAd.description}
            </Typography>

            {selectedAd.numberOfHives ? (
              <>
                <Typography variant="h5" sx={{ marginTop: "2rem" }}>
                  Information för biodlare
                </Typography>
                <Typography variant="body1">
                  Antal bikupor: {selectedAd.numberOfHives}
                </Typography>
              </>
            ) : selectedAd.areaSize ? (
              <>
                <Typography variant="h5" sx={{ marginTop: "2rem" }}>
                  Information för markägare
                </Typography>
                <Typography variant="body1">
                  Markyta: {selectedAd.areaSize} hektar
                </Typography>
                <Typography variant="body1">
                  Grödor: {selectedAd.crops || "Ej specificerat"}
                </Typography>
                <Typography variant="body1">
                  Använder besprutning: {selectedAd.spraying ? "Ja" : "Nej"}
                </Typography>
                <Typography variant="body1">
                  Använder gödsel:{" "}
                  {selectedAd.fertilization || "Ej specificerat"}
                </Typography>
              </>
            ) : null}
          </Grid>

          {selectedAd.profileId != userProfile?.id && (
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#fff",
                  padding: "2rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Kontakta annonsören
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "1.5rem",
                    backgroundColor: "#FFA500",
                    padding: "0.75rem 1.5rem",
                    "&:hover": {
                      backgroundColor: "#cc8500",
                    },
                  }}
                  onClick={handleNavigateToChat} // Skapa eller navigera till chatt
                >
                  Starta chatt
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Typography variant="h6">Ingen annons hittades.</Typography>
      )}
    </Box>
  );
};

export default AdDetailPage;
