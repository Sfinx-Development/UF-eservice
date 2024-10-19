import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdAsync } from "../SLICES/adSlice"; // Förutsätter att du har en thunk för att hämta en annons
import { useAppDispatch, useAppSelector } from "../SLICES/store";

const AdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedAd = useAppSelector((state) => state.adSlice.selectedAd);
  const error = useAppSelector((state) => state.adSlice.error);
  const loading = useAppSelector((state) => state.adSlice.loading);

  useEffect(() => {
    if (id) {
      dispatch(getAdAsync(id)); // Hämta annonsen baserat på ID
    }
  }, [dispatch, id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        padding: "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : selectedAd ? (
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel och plats */}
          <Grid item xs={12}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
              {selectedAd.title}
            </Typography>
            <Typography variant="h6" sx={{ color: "#777" }}>
              Plats: {selectedAd.location}
            </Typography>
          </Grid>

          {/* Huvudinnehåll */}
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {selectedAd.description}
            </Typography>

            {selectedAd.numberOfHives ? (
              <>
                <Typography variant="h5" sx={{ marginTop: "2rem" }}>
                  Information för biodlare
                </Typography>
                <Typography variant="body1">
                  Antal bikupor: {selectedAd.numberOfHives}
                </Typography>
                <Typography variant="body1">
                  Typ av bin: {selectedAd.beeType || "Ej specificerat"}
                </Typography>
                <Typography variant="body1">
                  Föreslagen kostnad: {selectedAd.cost || "Ej angivet"}
                </Typography>
              </>
            ) : selectedAd.areaSize ? (
              <>
                <Typography variant="h5" sx={{ marginTop: "2rem" }}>
                  Information för markägare
                </Typography>
                <Typography variant="body1">
                  Markyta: {selectedAd.areaSize} hektar
                </Typography>
                <Typography variant="body1">
                  Grödor: {selectedAd.crops || "Ej specificerat"}
                </Typography>
                <Typography variant="body1">
                  Använder besprutning: {selectedAd.spraying ? "Ja" : "Nej"}
                </Typography>
                <Typography variant="body1">
                  Använder gödsel:{" "}
                  {selectedAd.fertilization || "Ej specificerat"}
                </Typography>
              </>
            ) : null}
          </Grid>

          {/* Kontakta sektionen */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Kontakta annonsören
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginTop: "1.5rem",
                  backgroundColor: "#FFA500",
                  padding: "0.75rem 1.5rem",
                  "&:hover": {
                    backgroundColor: "#cc8500",
                  },
                }}
                onClick={() => {
                  navigate(`/chat/${selectedAd.profileId}`); // Navigera till chatten
                }}
              >
                Starta chatt
              </Button>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">Ingen annons hittades.</Typography>
      )}
    </Box>
  );
};

export default AdDetailPage;