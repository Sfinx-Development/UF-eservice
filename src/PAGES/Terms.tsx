import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function Terms() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "start",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "1rem" : "4rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
        Användarvillkor
      </Typography>
      <Typography sx={{ marginBottom: 2, textAlign: "center" }}>
        Tack för att du använder Beezmartuf.se! Genom att registrera dig och
        använda vår tjänst godkänner du följande villkor:
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 1: General */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        1. Allmänt
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        1.1 Dessa villkor reglerar användningen av webbplatsen Beezmartuf.se och
        dess tjänster.
        <br />
        1.2 Beezmartuf.se är en plattform som kopplar samman biodlare och
        markägare för att underlätta samarbete.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 2: User Accounts */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        2. Användarkonto
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        2.1 För att använda tjänsten måste du skapa ett konto och ange korrekt
        och fullständig information.
        <br />
        2.2 Du ansvarar för att hålla ditt lösenord säkert och för alla
        aktiviteter som sker via ditt konto.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 3: Usage */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        3. Användning av tjänsten
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        3.1 Tjänsten får endast användas för de syften som anges, såsom att
        skapa kontakt mellan biodlare och markägare.
        <br />
        3.2 Det är förbjudet att:
      </Typography>
      <ul>
        <li>Publicera stötande, olagligt eller vilseledande innehåll.</li>
        <li>Missbruka plattformen eller manipulera dess funktioner.</li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 4: Fees */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        4. Avgifter
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        4.1 Tjänsten är kostnadsfri att använda för registrering och allmän
        sökning, men en avgift på 29 kr tillkommer för varje enskild annons som
        användaren skapar.
        <br />
        4.2 Alla betalningar hanteras säkert via våra betalningslösningar, som
        inkluderar Swish och kortbetalning.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 5: Limitation of Liability */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        5. Ansvarsbegränsning
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        5.1 Beezmartuf.se tar inget ansvar för innehållet i användarnas annonser
        eller kommunikation mellan användare.
        <br />
        5.2 Vi strävar efter att hålla tjänsten säker och tillgänglig, men
        garanterar inte att tjänsten alltid kommer att fungera utan avbrott
        eller fel.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 6: Termination */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        6. Uppsägning
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        6.1 Vi förbehåller oss rätten att stänga av eller radera användarkonton
        som bryter mot våra villkor.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 7: Amendments */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        7. Ändringar av villkor
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        7.1 Vi förbehåller oss rätten att ändra dessa villkor. Användare kommer
        att meddelas om ändringar.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 8: Contact */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        8. Kontakt
      </Typography>
      <Typography>
        Om du har frågor om våra användarvillkor, vänligen kontakta oss:
        <br />
        E-post: <a href="mailto:beezmartuf@gmail.com">beezmartuf@gmail.com</a>
      </Typography>
    </Box>
  );
}
