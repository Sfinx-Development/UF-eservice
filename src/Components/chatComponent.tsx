import React, { useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../SLICES/store"; // Se till att inkludera useAppDispatch
import { addMessageAsync, getAllMessagesAsync, updateMessageAsync, deleteMessageAsync } from "../SLICES/messageSlice";

const ChatComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messageSlice.messages); // Hämta meddelanden från Redux
  const user = useAppSelector((state) => state.userSlice.user);
  const [messageText, setMessageText] = React.useState("");

  useEffect(() => {
    // Hämta alla meddelanden vid komponentens montering
    dispatch(getAllMessagesAsync());
  }, [dispatch]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        text: messageText,
        userId: user?.id || "", // Använd en tom sträng om userId är undefined
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

  return (
    <Box sx={{ height: "400px", overflowY: "scroll", border: "1px solid #ccc", padding: "1rem" }}>
      {messages.map((message) => (
        <Box key={message.id} sx={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
          <Typography variant="body1">
            <strong>{message.username}</strong>: {message.text}
          </Typography>
          <Typography variant="caption">
            {new Date(message.timestamp).toLocaleString()}
          </Typography>
          {message.userId === user?.id && (
            <Box>
              {/* <Button onClick={() => editMessage(message.id)}>Redigera</Button>
              <Button onClick={() => deleteMessage(message.id)}>Ta bort</Button> */}
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
      />
      <Button onClick={handleSendMessage} sx={{ marginTop: "1rem" }}>
        Skicka
      </Button>
    </Box>
  );
};

export default ChatComponent;
