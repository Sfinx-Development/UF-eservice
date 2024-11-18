import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
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
              <Button
                variant="outlined"
                onClick={() => {
                  navigate("/profile");
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
                <Person2Icon />
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
          backgroundColor: "#222", // Modern mörk färg
          color: "#fff",
          padding: "2rem 1rem",
          textAlign: "left", // Vänsterjusterat innehåll
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Kolumner på stora skärmar
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Kolumn 1: BeeZmart Info */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              BeeZmart UF
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#bbb", marginBottom: "1rem" }}
            >
              En smart e-tjänst för biodlare och markägare.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#bbb",
              }}
            >
              För frågor eller support:{" "}
              <Link
                href="mailto:beezmartuf@gmail.com"
                sx={{
                  color: "#FFA500",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                beezmartuf@gmail.com
              </Link>
            </Typography>
          </Box>

          {/* Kolumn 2: Snabblänkar */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              Snabblänkar
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <Link
                href="/dashboard"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Dashboard
              </Link>
              <Link
                href="/newad"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Lägg till annons
              </Link>
              <Link
                href="/chatlist"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Visa chattar
              </Link>
              <Link
                href="/admin-login"
                sx={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Administration
              </Link>
            </Box>
          </Box>

          {/* Kolumn 3: Powered by Zeroett */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              Powered By
            </Typography>
            <Link
              href="https://zeroett.se"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#FFA500",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Zeroett AB
            </Link>
            <Typography
              variant="body2"
              sx={{ color: "#bbb", marginTop: "0.5rem", fontSize: "0.85rem" }}
            >
              BeeZmart UF utvecklades med stöd från Zeroett AB.
            </Typography>
          </Box>
        </Box>

        {/* Upphovsrätt */}
        <Box
          sx={{
            borderTop: "1px solid #444",
            marginTop: "2rem",
            paddingTop: "1rem",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", color: "#bbb" }}
          >
            © 2024 BeeZmart UF. Alla rättigheter förbehållna.
          </Typography>
        </Box>
      </footer>
    </div>
  );
};

export default RootLayout;
