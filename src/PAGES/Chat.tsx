import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addChatMessageAsync, getChatByIdAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { ChatMessage } from "../types";

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const { selectedChat, loading, error } = useAppSelector(
    (state) => state.chatSlice
  );
  const [newMessage, setNewMessage] = useState("");
  const user = useAppSelector((state) => state.userSlice.user);

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
            messageId: "",
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
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",
        backgroundColor: "#f4f4f4",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : selectedChat ? (
        <Box sx={{ width: "100%", maxWidth: "800px" }}>
          {/* Titel och Annonsinformation */}
          <Typography variant="h5" gutterBottom>
            Chat för annons: {selectedChat.adTitle}
          </Typography>

          {/* Lista över meddelanden */}
          <Paper
            sx={{
              padding: "1rem",
              marginBottom: "1rem",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {selectedChat.messages.length > 0 ? (
              selectedChat.messages.map((message: ChatMessage) => (
                <Box key={message.messageId} sx={{ marginBottom: "1rem" }}>
                  <Typography
                    variant="subtitle2"
                    color={
                      message.senderId === "currentUserId"
                        ? "primary"
                        : "secondary"
                    }
                  >
                    {message.senderName}:
                  </Typography>
                  <Typography variant="body1">{message.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>Inga meddelanden ännu.</Typography>
            )}
          </Paper>

          {/* Inputfält för att skriva ett nytt meddelande */}
          <TextField
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
            color="primary"
            fullWidth
            onClick={handleSendMessage}
          >
            Skicka
          </Button>
        </Box>
      ) : (
        <Typography>Ingen chatt hittades.</Typography>
      )}
    </Box>
  );
}
