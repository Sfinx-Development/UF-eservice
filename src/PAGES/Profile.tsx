import {
  Avatar,
  Box,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../SLICES/store";
import { Rubrik, Text } from "./Index";

export default function Profile() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const profileImages = user?.profileImages || [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "1rem" : "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "800px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar
          src={"/default-avatar.png"}
          alt={user?.username}
          sx={{
            width: "120px",
            height: "120px",
            border: "4px solid #FFA500",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Rubrik sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>
            {user?.username}
          </Rubrik>
          <Text sx={{ color: "#777", marginBottom: "0.5rem" }}>
            {user?.role}
          </Text>
          <Text sx={{ fontSize: "0.9rem", color: "#555" }}>
            Plats: {user?.city}
          </Text>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Rubrik sx={{ marginBottom: "1rem" }}>Om mig</Rubrik>
        <Text
          sx={{ color: "#555", marginBottom: "1.5rem", textAlign: "justify" }}
        >
          {user?.profileDescription}
        </Text>

        {profileImages.length > 0 && (
          <Grid container spacing={2}>
            {profileImages.slice(0, 4).map((image: string, index: number) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`Profile image ${index + 1}`}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Button
        variant="contained"
        sx={{
          marginTop: "2rem",
          backgroundColor: "#FFA500",
          color: "#FFF",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#cc8500",
          },
        }}
        onClick={() => navigate("/edit-profile")}
      >
        Redigera profil
      </Button>
    </Box>
  );
}
