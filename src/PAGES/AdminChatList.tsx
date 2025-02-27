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
import { getAllAdminChatSessionsAsync } from "../SLICES/adminChatSlice";
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
      dispatch(getAllAdminChatSessionsAsync());
    }
  }, [admin, dispatch]);

  const handleNavigateToChat = (chatId: string) => {
    navigate(`/support-chat/${chatId}`);
  };

  const sortedChatSessions = [...adminChatSessions]
    .filter((session) => session.messages && session.messages.length > 0) // ✅ Filtrerar bort sessioner utan meddelanden
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    ); // ✅ Sorterar efter senaste aktivitet

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
            flexGrow: 1, // 🔥 Gör att boxen expanderar och fyller ut
            width: "100%",
            maxWidth: isMobile ? "100%" : "900px",
            borderRadius: "8px",
            padding: "1rem",
            overflow: "hidden", // 🚨 Viktigt för att scrollen ska funka korrekt
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
              // marginBottom: "1rem",
              // maxHeight: isMobile ? "300px" : "500px",
              // overflowY: "auto",

              flexGrow: 1, // 🔥 Gör att listan tar upp all tillgänglig plats
              overflowY: "auto", // 🚀 Scrollar endast listan, inte hela sidan
              maxHeight: "calc(100vh - 200px)", // ✅ Anpassar höjden efter skärmen
              minHeight: isMobile ? "300px" : "500px", // Ger tillräckligt med utrymme
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
