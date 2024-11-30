import {
  Box,
  Button,
  CircularProgress,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addChatMessageAsync, getChatByIdAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { ChatMessage } from "../types";
import { Rubrik, Text } from "./Index";
import { RedBorderTextfield } from "./Register";

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const { selectedChat, loading, error } = useAppSelector(
    (state) => state.chatSlice
  );
  const [newMessage, setNewMessage] = useState("");
  const user = useAppSelector((state) => state.userSlice.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Hämta den aktuella chatten vid sidladdning
  useEffect(() => {
    if (chatId) {
      dispatch(getChatByIdAsync(chatId));
    }
  }, [chatId, dispatch]);

  // Hantera inskickning av nytt meddelande
  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId && user) {
      await dispatch(
        addChatMessageAsync({
          sessionId: chatId,
          message: {
            id: "",
            senderId: user.id,
            senderName: user.username,
            message: newMessage,
            timestamp: new Date().toISOString(),
            read: false,
          },
        })
      );
      setNewMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#510102",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : selectedChat ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: isMobile ? "100%" : "900px", // Anpassning för mobil och desktop
            backgroundColor: "#fffaeb",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel och Annonsinformation */}
          <Rubrik
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{ fontWeight: "bold", color: "#510102" }}
          >
            Chatt för annons: {selectedChat.adTitle}
          </Rubrik>

          {/* Lista över meddelanden */}
          <Box
            sx={{
              flex: 1,
              padding: "1rem",
              marginBottom: "1rem",
              maxHeight: isMobile ? "300px" : "400px",
              overflowY: "auto",
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            {selectedChat.messages.length > 0 ? (
              selectedChat.messages.map((message: ChatMessage) => (
                <Box
                  key={message.id}
                  sx={{
                    marginBottom: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      message.senderId === user?.id ? "flex-end" : "flex-start",
                  }}
                >
                  <Link
                    href={`/profile/${message.senderId}`}
                    sx={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color:
                          // message.senderId === user?.id
                          "#510102",
                        // : theme.palette.secondary.main,
                      }}
                    >
                      {message.senderName}:
                    </Typography>
                  </Link>
                  <Box
                    sx={{
                      backgroundColor: "rgba(81, 1, 2, 0.1)",
                      // message.senderId === user?.id ? "#E1FFC7" : "#FFF",
                      padding: "0.75rem",
                      borderRadius: "10px",
                      maxWidth: "80%",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "#510102" }}>
                      {message.message}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ marginTop: "0.25rem", color: "#510102" }}
                  >
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>Inga meddelanden ännu.</Typography>
            )}
          </Box>

          {/* Inputfält för att skriva ett nytt meddelande */}
          <RedBorderTextfield
            label="Skriv ett meddelande"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            multiline
            rows={2}
            sx={{ marginBottom: "1rem" }}
          />

          {/* Skicka meddelande-knapp */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSendMessage}
            sx={{
              padding: "0.75rem",
              color: "#fffaeb",
              backgroundColor: "#510102",
              "&:hover": {
                backgroundColor: "#6B2020",
              },
            }}
          >
            <Text>Skicka</Text>
          </Button>
        </Box>
      ) : (
        <Typography>Ingen chatt hittades.</Typography>
      )}
    </Box>
  );
}
