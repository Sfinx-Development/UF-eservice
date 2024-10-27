import HomeIcon from "@mui/icons-material/Home";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { logOutUserAsync } from "../SLICES/userSlice";

const RootLayout = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    await dispatch(logOutUserAsync()).then(() => {
      navigate("/");
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      {/* Header / Navbar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#FFF",
          height: "4rem",
          boxShadow: "none",
          borderBottom: "1px solid #ddd", // Tunn linje för att separera header från innehållet
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingX: 3, // Mer utrymme för att ge andrum
          }}
        >
          {/* Logotyp / Företagsnamn */}
          <Typography
            variant="h6"
            onClick={() => navigate("/")} // Klickbar logotyp som navigerar hem
            sx={{
              color: "#FFA500", // Gul/orange färg
              fontWeight: "bold",
              cursor: "pointer", // Gör logotypen klickbar
            }}
          >
            LOGGA
          </Typography>

          {/* Användarens navigeringsalternativ */}
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/dashboard");
                }}
                sx={{
                  borderColor: "#FFA500",
                  color: "#FFA500",
                  paddingX: 2,
                  "&:hover": {
                    borderColor: "#cc8500",
                    color: "#cc8500",
                  },
                }}
              >
                <HomeIcon />
              </Button>
              {/* Logga ut knapp */}
              <Button
                variant="outlined"
                onClick={handleSignOut}
                sx={{
                  borderColor: "#FFA500",
                  color: "#FFA500",
                  paddingX: 2,
                  "&:hover": {
                    borderColor: "#cc8500",
                    color: "#cc8500",
                  },
                }}
              >
                Logga ut
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          // flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          width: "100%",
          minHeight: "calc(100vh - 4rem)",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#333333", // Dark gray
          color: "white",
          width: "100%",
          textAlign: "center",
          padding: "1rem 0",
          marginTop: "auto",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
          }}
        >
          © 2024 Företaget
        </Typography>
      </footer>
    </div>
  );
};

export default RootLayout;
