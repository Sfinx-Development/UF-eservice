import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllChatsByProfileAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Rubrik, Text } from "./Index";

export default function ChatList() {
  const dispatch = useAppDispatch();
  const { chatSessions, loading } = useAppSelector((state) => state.chatSlice);
  const user = useAppSelector((state) => state.userSlice.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getAllChatsByProfileAsync(user.id));
    }
  }, [user, dispatch]);

  const handleNavigateToChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  // Sortera chatSessions baserat på det senaste "lastUpdated", nyaste först
  const sortedChatSessions = [...chatSessions].sort((a, b) => {
    return (
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f4f4f4",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : sortedChatSessions.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: isMobile ? "100%" : "900px", // Anpassning för mobil och desktop
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel */}
          <Rubrik
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Dina chattar
          </Rubrik>

          {/* Lista över alla chatt-sessioner */}
          <Paper
            sx={{
              padding: "1rem",
              marginBottom: "1rem",
              maxHeight: isMobile ? "300px" : "500px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            <List>
              {sortedChatSessions.map((chat) => (
                <ListItem
                  key={chat.id}
                  onClick={() => handleNavigateToChat(chat.id)}
                  sx={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <ListItemText
                    primary={`Annons: ${chat.adTitle}`}
                    secondary={`Senaste meddelande: ${new Date(
                      chat.lastUpdated
                    ).toLocaleString()}`}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#FFA500", // Orange border
                      color: "#FFA500", // Textfärg
                      "&:hover": {
                        borderColor: "#cc8500",
                        color: "#cc8500",
                      },
                    }}
                  >
                    <Text>Öppna chatt</Text>
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      ) : (
        <Text>Du har inga pågående chattar.</Text>
      )}
    </Box>
  );
}
