import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { Rubrik, Text } from "./Index";

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
        backgroundColor: "#fffaeb",
      }}
    >
      <Rubrik variant={isMobile ? "h4" : "h3"} gutterBottom>
        Integritetspolicy
      </Rubrik>
      <Text sx={{ marginBottom: 2, textAlign: "center" }}>
        Din integritet är viktig för oss. Denna policy förklarar hur
        Beezmartuf.se samlar in, använder och skyddar dina personuppgifter.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 1: Data Collection */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        1. Vilken information samlar vi in?
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        När du registrerar dig och använder vår tjänst kan vi samla in följande
        information:
      </Text>
      <ul>
        <li>
          {" "}
          <Text>
            <strong>Personuppgifter:</strong> E-postadress, användarnamn och
            stad.
          </Text>
        </li>
        <li>
          {" "}
          <Text>
            <strong>Profilinformation:</strong> Profilbeskrivning, annonser och
            roll (biodlare/markägare).
          </Text>
        </li>
        <li>
          <Text>
            <strong>Teknisk information:</strong> IP-adress, webbläsartyp och
            cookies.
          </Text>
        </li>
      </ul>
      <Text sx={{ marginBottom: 2 }}>
        När du lägger upp en annons och betalar med swish lagras det telefonnummer du angivit att du
        swishat med. Telefonnumret är till för att admin ska kunna verifiera betalningen och godkänna din annons.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 2: Data Usage */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        2. Hur använder vi din information?
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>Vi använder din information för att:</Text>
      <ul>
        <li>
          <Text>Tillhandahålla och förbättra vår tjänst.</Text>
        </li>
        <li>
          <Text>
            Möjliggöra kontakt mellan användare (t.ex. biodlare och markägare).
          </Text>
        </li>
        <li>
          <Text>
            Skicka viktiga meddelanden om tjänsten, såsom uppdateringar eller
            policyändringar.
          </Text>
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 3: Data Sharing */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        3. Hur delas din information?
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        3.1 Vi delar aldrig dina personuppgifter med tredje part utan ditt
        samtycke, förutom när det krävs enligt lag.
        <br />
        3.2 Viss information (t.ex. annonser och plats) kan vara synlig för
        andra användare beroende på dina inställningar.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 4: User Rights */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        4. Dina rättigheter
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>Enligt GDPR har du rätt att:</Text>
      <ul>
        <li>
          <Text>Få tillgång till de personuppgifter vi lagrar om dig.</Text>
        </li>
        <li>
          <Text>Rätta felaktiga uppgifter.</Text>
        </li>
        <li>
          <Text>Radera ditt konto och all lagrad information.</Text>
        </li>
        <li>
          {" "}
          <Text>
            Begränsa eller invända mot hur vi behandlar dina uppgifter.
          </Text>
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 5: Data Security */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        5. Säkerhet
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        Vi använder tekniska och organisatoriska åtgärder för att skydda din
        information, inklusive:
      </Text>
      <ul>
        <li>
          <Text>Kryptering av känslig data.</Text>
        </li>
        <li>
          <Text>Regelbundna säkerhetsuppdateringar.</Text>
        </li>
        <li>
          <Text>Åtkomstkontroll för att begränsa obehörig åtkomst.</Text>
        </li>
      </ul>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 6: Cookies */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        6. Cookies
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        Vi använder cookies för att förbättra användarupplevelsen. Du kan stänga
        av cookies via din webbläsare, men vissa funktioner kan då begränsas.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 7: Data Storage */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        7. Lagring av data
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        Din data lagras säkert på servrar inom EU/EES och raderas när den inte
        längre är nödvändig för det ändamål den samlades in.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 8: Policy Changes */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        8. Ändringar av policyn
      </Rubrik>
      <Text sx={{ marginBottom: 2 }}>
        Vi kan uppdatera denna policy och kommer att meddela dig om större
        ändringar.
      </Text>
      <Divider sx={{ width: "100%", marginBottom: "1rem" }} />

      {/** Section 9: Contact */}
      <Rubrik variant="h6" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        9. Kontakt
      </Rubrik>
      <Text>
        Om du har frågor om vår integritetspolicy, vänligen kontakta oss:
        <br />
        E-post: <a href="mailto:beezmartuf@gmail.com">beezmartuf@gmail.com</a>
      </Text>
    </Box>
  );
}
