import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllChatsByProfileAsync } from "../SLICES/chatSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Rubrik, Text } from "./Index";

export default function AdminChatList() {
  const dispatch = useAppDispatch();
  const { adminChatSessions, loading } = useAppSelector(
    (state) => state.adminChatSlice
  );
  const admin = useAppSelector((state) => state.userSlice.admin);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      dispatch(getAllChatsByProfileAsync(admin.id));
    }
  }, [admin, dispatch]);

  const handleNavigateToChat = (chatId: string) => {
    navigate(`/adminChat/${chatId}`);
  };

  const sortedChatSessions = [...adminChatSessions].sort((a, b) => {
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
        backgroundColor: "#fffaeb",
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
            maxWidth: isMobile ? "100%" : "900px",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <Rubrik
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Dina chattar
          </Rubrik>

          <Box
            sx={{
              marginBottom: "1rem",
              maxHeight: isMobile ? "300px" : "500px",
              overflowY: "auto",
            }}
          >
            <List>
              {sortedChatSessions.map((chat) => (
                <ListItem
                  key={chat.id}
                  onClick={() => handleNavigateToChat(chat.id)}
                  sx={{
                    marginBottom: "1rem",
                    padding: "1.5rem",
                    backgroundColor: "#510102",
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#6B2020",
                    },
                  }}
                >
                  <ListItemText
                    sx={{ color: "#fffaeb" }}
                    primary={`Användare: ${chat.userName}`}
                    secondary={
                      chat.hasUnreadMessages &&
                      chat.latestSenderId != admin?.id ? (
                        <Text variant="body2">Finns olästa meddelanden</Text>
                      ) : (
                        <Text variant="body2" sx={{ color: "#fffaeb" }}>
                          Senaste meddelande:{" "}
                          {new Date(chat.lastUpdated).toLocaleDateString()}
                        </Text>
                      )
                    }
                  />

                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#fffaeb",
                      color: "#fffaeb",
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
          </Box>
        </Box>
      ) : (
        <Text>Du har inga pågående chattar.</Text>
      )}
    </Box>
  );
}
