import {
  ChatBubbleOutline,
  Close,
  Delete,
  Edit,
  Send,
} from "@mui/icons-material";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addMessageAsync,
  deleteMessageAsync,
  getAllMessagesAsync,
  updateMessageAsync,
} from "../SLICES/messageSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Message } from "../types";

const ChatComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const user = useAppSelector((state) => state.userSlice.user);
  const admin = useAppSelector((state) => state.userSlice.admin);
  const [messageText, setMessageText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // För att kontrollera om chatten är öppen eller stängd
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);

  useEffect(() => {
    dispatch(getAllMessagesAsync());
  }, [dispatch]);

  useEffect(() => {
    const filteredMessages = [...messages].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();

      return dateA - dateB;
    });
    setFilteredMessages(filteredMessages);
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: uuidv4(),
        text: messageText,
        userId: user?.id || admin?.id,
        username: user?.username || admin?.username || "Anonym",
        timestamp: new Date().toISOString(),
        isAdmin: admin?.isAdmin || false,
      };
      if (newMessage.userId) {
        dispatch(addMessageAsync(newMessage));
        setMessageText("");
      }
    }
  };

  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId);
    if (messageToEdit) {
      setEditingMessageId(messageId);
      setMessageText(messageToEdit.text);
    }
  };

  const handleUpdateMessage = () => {
    if (editingMessageId && messageText.trim()) {
      const updatedMessage = {
        messageId: editingMessageId,
        updates: {
          text: messageText,
          timestamp: new Date().toISOString(),
        },
      };
      dispatch(updateMessageAsync(updatedMessage));
      setMessageText("");
      setEditingMessageId(null);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    dispatch(deleteMessageAsync(messageId));
  };

  return (
    <Box
      sx={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000 }}
    >
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            backgroundColor: "#FFA500",
            color: "#FFF",
            "&:hover": { backgroundColor: "#cc8500" },
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <ChatBubbleOutline />
        </IconButton>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            width: "300px",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem",
              backgroundColor: "#FFA500",
              color: "#fff",
            }}
          >
            <Typography variant="h6">Chatt</Typography>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{
                color: "#FFF",
                "&:hover": { color: "#cc8500" },
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "scroll",
              padding: "1rem",
              backgroundColor: "#fff",
            }}
          >
            {filteredMessages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  padding: "0.5rem",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {message.username}
                  </Typography>
                  {message.isAdmin && (
                    <VerifiedIcon
                      sx={{ color: "lightblue", fontSize: 12, marginLeft: 0.3 }}
                    />
                  )}
                </Box>
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {editingMessageId === message.id ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      size="small"
                    />
                  ) : (
                    message.text
                  )}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </Typography>
                  {message.userId === user?.id && (
                    <Box>
                      {editingMessageId === message.id ? (
                        <>
                          <IconButton
                            onClick={handleUpdateMessage}
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
                            onClick={() => handleEditMessage(message.id)}
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
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              padding: "1rem",
              backgroundColor: "#f5f5f5",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Skriv ett meddelande"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              size="small"
              sx={{ marginRight: "0.5rem" }}
            />
            <Button
              onClick={handleSendMessage}
              variant="contained"
              sx={{
                backgroundColor: "#FFA500",
                color: "#FFF",
                minWidth: "50px",
                "&:hover": { backgroundColor: "#cc8500" },
              }}
            >
              <Send />
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ChatComponent;
