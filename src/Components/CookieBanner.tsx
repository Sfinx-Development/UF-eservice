import { Box, Button, Link } from "@mui/material";
import { useEffect, useState } from "react";
import { Rubrik } from "../PAGES/Index";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
    window.location.reload(); // Ladda om sidan för att aktivera Google Analytics
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#222",
        color: "#fff",
        padding: "1rem",
        zIndex: 9999,
        textAlign: "center",
        boxShadow: "0px -2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Rubrik variant="body2">
        Vi använder cookies för att förbättra din upplevelse. Läs mer{" "}
        <Link
          href="/cookie-info"
          sx={{ color: "#fff", textDecoration: "underline" }}
        >
          här
        </Link>
        .
      </Rubrik>
      <Box sx={{ marginTop: "0.5rem" }}>
        <Button
          onClick={handleAccept}
          variant="contained"
          sx={{
            backgroundColor: "#510102",
            color: "#fffaeb",
            marginRight: "1rem",
            "&:hover": {
              backgroundColor: "#7b1c1c",
            },
          }}
        >
          <Rubrik>Acceptera</Rubrik>
        </Button>
        <Button
          onClick={handleDecline}
          variant="outlined"
          sx={{
            borderColor: "#fffaeb",
            color: "#fffaeb",
            "&:hover": {
              borderColor: "#fffaeb",
              backgroundColor: "#333",
            },
          }}
        >
          <Rubrik>Avböj</Rubrik>
        </Button>
      </Box>
    </Box>
  );
};

export default CookieBanner;
