import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from "../Components/chatComponent";
import { useAppSelector } from "../SLICES/store";
import { Rubrik, Text } from "./Index";

const AdminDashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const admin = useAppSelector((state) => state.userSlice.admin);
  //   const adsByLocation = useAppSelector((state) => state.adSlice.adsByLocation);
  //   const chatSessions = useAppSelector((state) => state.chatSlice.chatSessions);
  //   const dispatch = useAppDispatch();
  //   const [unreadMessages, setUnreadMessages] = useState(0);

  //   useEffect(() => {
  //     if (admin) {
  //       dispatch(getAdsByLocationAsync(user.city));
  //     }
  //   }, [user]);

  //   useEffect(() => {
  //     if (user) {
  //       dispatch(getAllChatsByProfileAsync(user?.id));
  //     }
  //   }, [user]);

  //   useEffect(() => {
  //     if (chatSessions) {
  //       const unreadSessions = chatSessions.filter(
  //         (c) => c.hasUnreadMessages == true && c.latestSenderId != user?.id
  //       ).length;
  //       setUnreadMessages(unreadSessions);
  //     }
  //   }, [chatSessions]);

  //   const handleNavigateToAd = (ad: Ad) => {
  //     dispatch(setSelectedAd(ad));
  //     navigate("/addetail");
  //   };

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
        backgroundColor: "#f7f7f7",
      }}
    >
      <Rubrik variant={isMobile ? "h4" : "h3"} gutterBottom>
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
            borderColor: "#FFA500",
            color: "#FFA500",
            padding: "0.75rem 1.5rem",
            fontSize: isMobile ? "1rem" : "1.2rem",
            "&:hover": {
              borderColor: "#cc8500",
              color: "#cc8500",
            },
          }}
          onClick={() => {
            navigate("/admin-adlist");
          }}
        >
          <Text> Visa ogranskade annonser</Text>
        </Button>

        {/* <Badge
          badgeContent={unreadMessages}
          color="success"
          invisible={unreadMessages === 0}
        > */}
        {/* <Button
            variant="outlined"
            sx={{
              borderColor: "#FFA500",
              color: "#FFA500",
              padding: "0.75rem 1.5rem",
              fontSize: isMobile ? "1rem" : "1.2rem",
              gap: 1,
              "&:hover": {
                borderColor: "#cc8500",
                color: "#cc8500",
              },
            }}
            onClick={() => {
              navigate("/admin-chatlist");
            }}
          >
            <Text>Visa alla chattar</Text>
            <ChatIcon />
          </Button> */}
        {/* </Badge> */}
      </Box>

      <ChatComponent />
    </Box>
  );
};

export default AdminDashboardPage;
