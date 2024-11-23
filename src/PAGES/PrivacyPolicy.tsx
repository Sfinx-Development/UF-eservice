import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

export default function PrivacyPolicy() {
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
        Integritetspolicy
      </Typography>
      <Typography sx={{ marginBottom: 2, textAlign: "center" }}>
        Din integritet är viktig för oss. Denna policy förklarar hur
        Beezmartuf.se samlar in, använder och skyddar dina personuppgifter.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 1: Data Collection */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        1. Vilken information samlar vi in?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        När du registrerar dig och använder vår tjänst kan vi samla in följande
        information:
      </Typography>
      <ul>
        <li>
          <strong>Personuppgifter:</strong> E-postadress, användarnamn och stad.
        </li>
        <li>
          <strong>Profilinformation:</strong> Profilbeskrivning, annonser och
          roll (biodlare/markägare).
        </li>
        <li>
          <strong>Teknisk information:</strong> IP-adress, webbläsartyp och
          cookies.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 2: Data Usage */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        2. Hur använder vi din information?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi använder din information för att:
      </Typography>
      <ul>
        <li>Tillhandahålla och förbättra vår tjänst.</li>
        <li>
          Möjliggöra kontakt mellan användare (t.ex. biodlare och markägare).
        </li>
        <li>
          Skicka viktiga meddelanden om tjänsten, såsom uppdateringar eller
          policyändringar.
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 3: Data Sharing */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        3. Hur delas din information?
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        3.1 Vi delar aldrig dina personuppgifter med tredje part utan ditt
        samtycke, förutom när det krävs enligt lag.
        <br />
        3.2 Viss information (t.ex. annonser och plats) kan vara synlig för
        andra användare beroende på dina inställningar.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 4: User Rights */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        4. Dina rättigheter
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Enligt GDPR har du rätt att:
      </Typography>
      <ul>
        <li>Få tillgång till de personuppgifter vi lagrar om dig.</li>
        <li>Rätta felaktiga uppgifter.</li>
        <li>Radera ditt konto och all lagrad information.</li>
        <li>Begränsa eller invända mot hur vi behandlar dina uppgifter.</li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 5: Data Security */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        5. Säkerhet
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi använder tekniska och organisatoriska åtgärder för att skydda din
        information, inklusive:
      </Typography>
      <ul>
        <li>Kryptering av känslig data.</li>
        <li>Regelbundna säkerhetsuppdateringar.</li>
        <li>Åtkomstkontroll för att begränsa obehörig åtkomst.</li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 6: Cookies */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        6. Cookies
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi använder cookies för att förbättra användarupplevelsen. Du kan stänga
        av cookies via din webbläsare, men vissa funktioner kan då begränsas.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 7: Data Storage */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        7. Lagring av data
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Din data lagras säkert på servrar inom EU/EES och raderas när den inte
        längre är nödvändig för det ändamål den samlades in.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 8: Policy Changes */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        8. Ändringar av policyn
      </Typography>
      <Typography sx={{ marginBottom: 2 }}>
        Vi kan uppdatera denna policy och kommer att meddela dig om större
        ändringar.
      </Typography>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 9: Contact */}
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        9. Kontakt
      </Typography>
      <Typography>
        Om du har frågor om vår integritetspolicy, vänligen kontakta oss:
        <br />
        E-post: <a href="mailto:beezmartuf@gmail.com">beezmartuf@gmail.com</a>
      </Typography>
    </Box>
  );
}
