import HomeIcon from "@mui/icons-material/Home";
import Person2Icon from "@mui/icons-material/Person2";
import { AppBar, Box, Button, Link, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { logOutUserAsync } from "../SLICES/userSlice";
import { Rubrik, Text } from "./Index";
const RootLayout = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  const admin = useAppSelector((state) => state.userSlice.admin);
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

      {/* Header / Navbar */}
      <AppBar
        position="static"
        component="header"
        sx={{
          backgroundColor: "#fffaeb",
          height: { xs: "4rem", md: "4.5rem" }, // Ge tillräcklig höjd för ikoner och innehåll
          paddingX: { xs: 2, md: 3 }, // Mindre padding på mindre skärmar
          boxSizing: "border-box",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%", // Se till att allt innehåll är centrerat
          }}
        >
          {/* Logotyp */}
          <img
            src="https://i.imgur.com/AP6Z5iV.png"
            alt="Logo for BeeZmart UF"
            style={{
              height: "3rem", // Anpassad höjd för telefoner
              maxHeight: "100%",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          />

          {/* Användarens navigeringsalternativ */}
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 },
                flexDirection: { xs: "row", md: "row" }, // Kolumnlayout för mindre skärmar
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard")}
                sx={{
                  borderColor: "#510102",
                  color: "#510102",
                  paddingX: { xs: 1, md: 2 },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  "&:hover": {
                    borderColor: "#510102",
                    color: "#510102",
                  },
                }}
              >
                <HomeIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/profile")}
                sx={{
                  borderColor: "#510102",
                  color: "#510102",
                  paddingX: { xs: 1, md: 2 },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  "&:hover": {
                    borderColor: "#510102",
                    color: "#510102",
                  },
                }}
              >
                <Person2Icon />
              </Button>
              <Button
                variant="outlined"
                onClick={handleSignOut}
                sx={{
                  borderColor: "#510102",
                  color: "#510102",
                  paddingX: { xs: 1, md: 2 },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  "&:hover": {
                    borderColor: "#510102",
                    color: "#510102",
                  },
                }}
              >
                Logga ut
              </Button>
            </Box>
          )}
          {admin && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 },
                flexDirection: { xs: "row", md: "row" },
              }}
            >
              {" "}
              <Button
                variant="outlined"
                onClick={handleSignOut}
                sx={{
                  borderColor: "#510102",
                  color: "#510102",
                  paddingX: { xs: 1, md: 2 },
                  fontSize: { xs: "0.8rem", md: "1rem" },
                  "&:hover": {
                    borderColor: "#510102",
                    color: "#510102",
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

      <footer
        style={{
          backgroundColor: "#510102", // Bakgrundsfärg
          color: "#fffaeb", // Textfärg
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
            <Rubrik
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              BeeZmart UF
            </Rubrik>
            <Text
              variant="body2"
              sx={{ color: "#fffaeb", marginBottom: "1rem" }}
            >
              En smart e-tjänst för biodlare och markägare.
            </Text>
            <Text variant="body2" sx={{ color: "#fffaeb" }}>
              För frågor eller support:{" "}
              <Link
                href="mailto:beezmartuf@gmail.com"
                sx={{
                  color: "#fffaeb",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                beezmartuf@gmail.com
              </Link>
            </Text>
          </Box>

          {/* Kolumn 2: Snabblänkar */}
          <Box>
            <Rubrik
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              Snabblänkar
            </Rubrik>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            >
              <Link
                href="/dashboard"
                sx={{
                  color: "#fffaeb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Text>Dashboard</Text>
              </Link>
              <Link
                href="/privacy-policy"
                sx={{
                  color: "#fffaeb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Text>Integritetspolicy</Text>
              </Link>
              <Link
                href="/terms"
                sx={{
                  color: "#fffaeb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Text>Användarvillkor</Text>
              </Link>
              <Link
                href="/admin-login"
                sx={{
                  color: "#fffaeb",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Text>Administration</Text>
              </Link>
            </Box>
          </Box>

          {/* Kolumn 3: Powered by Zeroett */}
          <Box>
            <Rubrik
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "0.5rem",
              }}
            >
              Powered By
            </Rubrik>
            <Link
              href="https://zeroett.se"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#fffaeb",
                fontWeight: "bold",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Text>Zeroett AB</Text>
            </Link>
            <Text
              variant="body2"
              sx={{
                color: "#fffaeb",
                marginTop: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              BeeZmart UF utvecklades med stöd från Zeroett AB.
            </Text>
          </Box>
        </Box>

        {/* Upphovsrätt */}
        <Box
          sx={{
            borderTop: "1px solid #fffaeb",
            marginTop: "2rem",
            paddingTop: "1rem",
            textAlign: "center",
          }}
        >
          <Text variant="body2" sx={{ fontSize: "0.8rem", color: "#fffaeb" }}>
            © 2024 BeeZmart UF. Alla rättigheter förbehållna.
          </Text>
        </Box>
      </footer>
    </div>
  );
};

export default RootLayout;
