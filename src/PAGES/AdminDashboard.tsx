import ChatIcon from "@mui/icons-material/Chat";
import { Badge, Box, Button, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../Components/chatComponent";
import { useAppSelector } from "../SLICES/store";
import { Rubrik, Text } from "./Index";

const AdminDashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const admin = useAppSelector((state) => state.userSlice.admin);
  const chatSessions = useAppSelector(
    (state) => state.adminChatSlice.adminChatSessions
  );
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (chatSessions) {
      const unreadSessions = chatSessions.filter(
        (c) => c.hasUnreadMessages == true && c.latestSenderId != admin?.id
      ).length;
      setUnreadMessages(unreadSessions);
    }
  }, [chatSessions]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "1rem" : "2rem",
        backgroundColor: "#fffaeb",
      }}
    >
      <Rubrik
        variant={isMobile ? "h4" : "h3"}
        sx={{ color: "#510102" }}
        gutterBottom
      >
        Välkommen tillbaka, {admin?.username}! {admin?.isAdmin}
      </Rubrik>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          marginBottom: "2rem",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderColor: "#510102",
            color: "#510102",
            padding: "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            "&:hover": {
              borderColor: "#6B2020",
              color: "#6B2020",
            },
          }}
          onClick={() => {
            navigate("/admin-adlist");
          }}
        >
          <Text> Visa ogranskade annonser</Text>
        </Button>

        <Badge
          badgeContent={unreadMessages}
          color="success"
          invisible={unreadMessages === 0}
        >
          <Button
            variant="outlined"
            sx={{
              borderColor: "#510102",
              color: "#510102",
              padding: "0.75rem 1.5rem",
              fontSize: isMobile ? "1rem" : "1.2rem",
              gap: 1,
              "&:hover": {
                borderColor: "#6B2020",
                color: "#6B2020",
              },
            }}
            onClick={() => {
              navigate("/admin-chatlist");
            }}
          >
            <Text>Alla adminchattar</Text>
            <ChatIcon />
          </Button>
        </Badge>
      </Box>

      <ChatComponent />
    </Box>
  );
};

export default AdminDashboardPage;
