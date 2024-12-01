import { Box, Link } from "@mui/material";
import React from "react";
import { Rubrik, Text } from "./Index";

const CookieInfo: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        paddingX: 2,
        backgroundColor: "#fffaeb",
        color: "#510102",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(81, 1, 2, 0.1)",
      }}
    >
      <Rubrik variant="h4" textAlign="center" gutterBottom>
        Cookie-information
      </Rubrik>
      <Text variant="body1" paragraph>
        På <strong>BeeZmart</strong> använder vi cookies för att förbättra din
        upplevelse av vår webbplats. Cookies är små textfiler som lagras i din
        webbläsare och hjälper oss att analysera hur webbplatsen används.
      </Text>
      <Text variant="body1" paragraph>
        Vi använder <strong>Google Analytics</strong> för att samla in
        information om besöksstatistik, inklusive:
      </Text>
      <ul>
        <Text>Hur användare navigerar på webbplatsen</Text>
        <Text>Vilka sidor som är mest populära</Text>
        <Text>Var användarna befinner sig geografiskt</Text>
        <Text>Vilka enheter och webbläsare som används</Text>
      </ul>
      <Text variant="body1" paragraph>
        Informationen används endast för att förbättra vår webbplats och
        användarupplevelse. Ingen personlig information samlas in som kan
        identifiera dig direkt.
      </Text>
      <Text variant="body1" paragraph>
        Du kan välja att acceptera eller avböja cookies via bannern som visas
        när du besöker vår webbplats. Om du avböjer cookies kommer inga analyser
        eller spårning att göras.
      </Text>
      <Text variant="body1" paragraph>
        Läs mer om hur Google hanterar data i deras{" "}
        <Link
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: "#510102", textDecoration: "underline" }}
        >
          integritetspolicy
        </Link>
        .
      </Text>
      <Text variant="body1" paragraph>
        Har du frågor om cookies eller vår användning av dem, vänligen kontakta
        oss via{" "}
        <Link
          href="mailto:beezmartuf@gmail.com"
          sx={{ color: "#510102", textDecoration: "underline" }}
        >
          beezmartuf@gmail.com
        </Link>
        .
      </Text>
    </Box>
  );
};

export default CookieInfo;
