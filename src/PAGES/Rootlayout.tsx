import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
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
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          height: "4rem",
          boxShadow: "none",
          padding: 0,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",

            padding: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#FFA500",
              paddingX: 2,
            }}
          >
            LOGGA
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "calc(100vh - 4rem)",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>

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
