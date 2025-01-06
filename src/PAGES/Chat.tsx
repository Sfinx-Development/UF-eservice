import { Delete, Edit, Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addChatMessageAsync,
  deleteChatMessageAsync,
  getChatByIdAsync,
  updateChatMessageAsync,
} from "../SLICES/chatSlice";
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

  const [messageText, setMessageText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (chatId) {
      dispatch(getChatByIdAsync(chatId));
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    console.log(
      "CHAT ID: ",
      chatId,
      "User id: ",
      user?.id,
      "messagE: ",
      newMessage
    );
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

  const handleUpdateMessage = () => {
    if (editingMessageId && messageText.trim()) {
      const message = selectedChat?.messages.find(
        (m) => m.id == editingMessageId
      );
      if (message) {
        const updatedMessage: ChatMessage = {
          ...message,
          message: messageText,
          timestamp: new Date().toISOString(),
        };
        if (updatedMessage && selectedChat && editingMessageId) {
          dispatch(
            updateChatMessageAsync({
              sessionId: selectedChat.id,
              messageId: editingMessageId,
              updatedMessage: updatedMessage,
            })
          );
          setMessageText("");
          setEditingMessageId(null);
        }
      }
    }
  };

  const handleEditMessage = (message: ChatMessage) => {
    const foundMessage = selectedChat?.messages.find((m) => m.id == message.id);
    if (foundMessage) {
      setEditingMessageId(foundMessage.id);
      setMessageText(foundMessage.message);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (selectedChat && messageId) {
      dispatch(
        deleteChatMessageAsync({
          sessionId: selectedChat.id,
          messageId: messageId,
        })
      );
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
                    <Text
                      variant="subtitle2"
                      sx={{
                        color:
                          // message.senderId === user?.id
                          "#510102",
                        // : theme.palette.secondary.main,
                      }}
                    >
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
                    {editingMessageId === message.id ? (
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        size="small"
                      />
                    ) : (
                      <Text variant="body1" sx={{ color: "#510102" }}>
                        {message.message}
                      </Text>
                    )}
                  </Box>
                  <Text
                    variant="caption"
                    sx={{ marginTop: "0.25rem", color: "#510102" }}
                  >
                    {new Date(message.timestamp).toLocaleString()}
                  </Text>
                  {message.senderId === user?.id && (
                    <Box>
                      {editingMessageId === message.id ? (
                        <>
                          <IconButton
                            onClick={() => handleUpdateMessage()}
                            size="small"
                            color="primary"
                          >
                            <Send fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => setEditingMessageId(null)}
                            size="small"
                            color="secondary"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => handleEditMessage(message)}
                            size="small"
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteMessage(message.id)}
                            size="small"
                            color="secondary"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}
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
