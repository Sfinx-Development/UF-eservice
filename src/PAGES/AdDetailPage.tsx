import { Box, Button, Card, CircularProgress, Grid, Link } from "@mui/material";
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
import { Text } from "./Index";

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
        backgroundColor: "#510102",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Text color="error">{error}</Text>
      ) : selectedAd ? (
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fffaeb",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel och plats */}
          <Grid item xs={12}>
            <Text
              variant="h3"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#510102" }}
            >
              {selectedAd.title}
            </Text>
            <Text variant="h6" sx={{ color: "#510102" }}>
              Plats: {selectedAd.location}
            </Text>
            <Link
              href={`profile/${selectedAd.profileId}`}
              sx={{ textDecoration: "none" }}
            >
              <Text variant="h6" sx={{ color: "#510102" }}>
                Om annonsören
              </Text>
            </Link>
          </Grid>

          {/* Huvudinnehåll */}
          <Grid item xs={12} md={8}>
            <Text sx={{ color: "#510102" }} variant="body1" paragraph>
              {selectedAd.description}
            </Text>

            {selectedAd.numberOfHives ? (
              <>
                <Text variant="h5" sx={{ marginTop: "2rem", color: "#510102" }}>
                  Information för biodlare
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Antal bikupor: {selectedAd.numberOfHives}
                </Text>
              </>
            ) : selectedAd.areaSize ? (
              <>
                <Text variant="h5" sx={{ marginTop: "2rem", color: "#510102" }}>
                  Information för markägare
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Markyta: {selectedAd.areaSize} hektar
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Grödor: {selectedAd.crops || "Ej specificerat"}
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Använder besprutning: {selectedAd.spraying ? "Ja" : "Nej"}
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Använder gödsel:{" "}
                  {selectedAd.fertilization || "Ej specificerat"}
                </Text>
              </>
            ) : null}
          </Grid>

          {selectedAd.profileId != userProfile?.id && (
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  backgroundColor: "#510102",
                  padding: "2rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Text variant="h5" gutterBottom sx={{ color: "#fffaeb" }}>
                  Kontakta annonsören
                </Text>
                <Button
                  variant="contained"
                  sx={{
                    marginTop: "1.5rem",
                    backgroundColor: "#fffaeb",
                    padding: "0.75rem 1.5rem",
                  }}
                  onClick={handleNavigateToChat} // Skapa eller navigera till chatt
                >
                  <Text sx={{ color: "#510102" }}> Starta chatt</Text>
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Text variant="h6">Ingen annons hittades.</Text>
      )}
    </Box>
  );
};

export default AdDetailPage;
