import {
  Box,
  Button,
  CircularProgress,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addAdminChatMessageAsync,
  getAdminChatByIdAsync,
} from "../SLICES/adminChatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { AdminUserMessage, Profile } from "../types";
import { Rubrik, Text } from "./Index";
import { RedBorderTextfield } from "./Register";

export default function AdminChat() {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useAppDispatch();
  const { selectedAdminChat, loading, error } = useAppSelector(
    (state) => state.adminChatSlice
  );
  const [newMessage, setNewMessage] = useState("");
  const user = useAppSelector((state) => state.userSlice.user);
  const admin = useAppSelector((state) => state.userSlice.admin);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else if (admin) {
      setCurrentUser(admin);
    }
  }, [user, admin]);

  useEffect(() => {
    if (chatId) {
      dispatch(getAdminChatByIdAsync(chatId));
    }
  }, [chatId, dispatch]);

  // Hantera inskickning av nytt meddelande
  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId && currentUser) {
      const message: AdminUserMessage = {
        id: "",
        senderId: currentUser.id,
        senderName: currentUser.username,
        message: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
        isAdmin: currentUser.isAdmin ?? false,
      };
      await dispatch(
        addAdminChatMessageAsync({
          sessionId: chatId,
          message,
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
        <Text color="error">{error}</Text>
      ) : selectedAdminChat ? (
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
          <Rubrik
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{ fontWeight: "bold", color: "#510102" }}
          >
            Support-chatt för {selectedAdminChat.userName}
          </Rubrik>

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
            {selectedAdminChat.messages.length > 0 ? (
              selectedAdminChat.messages.map((message: AdminUserMessage) => (
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
                    <Text
                      variant="subtitle2"
                      sx={{
                        color: message.isAdmin
                          ? "rgba(81, 1, 2, 0.8)"
                          : "#510102",
                        fontWeight: message.isAdmin ? "bold" : "normal",
                        display: "inline",
                      }}
                    >
                      {message.isAdmin && (
                        <span
                          style={{
                            backgroundColor: "rgba(81, 1, 2, 0.8)",
                            color: "#fff",
                            borderRadius: "4px",
                            padding: "0.2rem 0.5rem",
                            marginRight: "0.5rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          Administratör
                        </span>
                      )}
                      {message.senderName}:
                    </Text>
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
                    <Text variant="body1" sx={{ color: "#510102" }}>
                      {message.message}
                    </Text>
                  </Box>
                  <Text
                    variant="caption"
                    sx={{ marginTop: "0.25rem", color: "#510102" }}
                  >
                    {new Date(message.timestamp).toLocaleString()}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>Inga meddelanden ännu.</Text>
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
        <Text>Ingen chatt hittades.</Text>
      )}
    </Box>
  );
}
