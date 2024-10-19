import React, { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../SLICES/store"; // Se till att inkludera useAppDispatch
import {
  addMessageAsync,
  deleteMessageAsync,
  getAllMessagesAsync,
  updateMessageAsync,
//   deleteMessageAsync,
} from "../SLICES/messageSlice";

const ChatComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const user = useAppSelector((state) => state.userSlice.user);
  const [messageText, setMessageText] = React.useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);



  useEffect(() => {
    dispatch(getAllMessagesAsync());
  }, [dispatch]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: uuidv4(), 
        text: messageText,
        userId: user?.id,
        // userId: user?.id || "", // Använd en tom sträng om userId är undefined
        username: user?.username || "Anonym", // Använd "Anonym" om username är undefined
        timestamp: new Date(),
      };

      // Kontrollera om userId är en tom sträng (du kanske vill hantera detta)
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
          timestamp: new Date(), 
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
      sx={{
        height: "400px",
        overflowY: "scroll",
        border: "1px solid #FFA500",
        borderRadius: "8px",
        padding: "1rem",
        backgroundColor: "#fff",
      }}
    >
      {messages.map((message) => (
        <Box key={message.id} sx={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
          {editingMessageId === message.id ? (
            <TextField
              fullWidth
              variant="outlined"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              sx={{ marginTop: "0.5rem" }} 
            />
          ) : (
            <>
              <Typography variant="body1">
                <strong>{message.username}</strong>: {message.text}
              </Typography>
              <Typography variant="caption">
                {new Date(message.timestamp).toLocaleString()}
              </Typography>
            </>
          )}
          {message.userId === user?.id && (
            <Box>
              {editingMessageId === message.id ? (
                <>
                  <Button onClick={handleUpdateMessage}>Uppdatera</Button>
                  <Button onClick={() => setEditingMessageId(null)}>Avbryt</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleEditMessage(message.id)}>Redigera</Button>
                  <Button onClick={() => handleDeleteMessage(message.id)}>Ta bort</Button>
                </>
              )}
            </Box>
          )}
        </Box>
      ))}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Skriv ett meddelande"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        sx={{ marginTop: "1rem" }} 
      />
      <Button
        onClick={handleSendMessage}
        sx={{
          marginTop: "1rem",
          backgroundColor: "#FFA500", 
          color: "#FFF",
          "&:hover": {
            backgroundColor: "#cc8500", 
          },
        }}
      >
        Skicka
      </Button>
    </Box>
  );
};

export default ChatComponent;