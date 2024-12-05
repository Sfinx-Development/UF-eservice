import { Box, Button, Card, CircularProgress, Grid, Link } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { updateAdAsync } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";
import { Text } from "./Index";

const AdminAdDetailPage: React.FC = () => {
  //   const navigate = useNavigate();
  const selectedAd = useAppSelector((state) => state.adSlice.selectedAd);
  //   const admin = useAppSelector((state) => state.userSlice.admin);
  const error = useAppSelector((state) => state.adSlice.error);
  const loading = useAppSelector((state) => state.adSlice.loading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAcceptAd = () => {
    if (selectedAd) {
      const updatedAd: Ad = {
        ...selectedAd,
        isPublic: true,
        isReviewed: true,
      };
      dispatch(updateAdAsync({ adId: selectedAd.id, updates: updatedAd }));
      navigate("/admin-adlist");
    }
  };
  const handleDeclineAd = () => {
    if (selectedAd) {
      //skicka meddelande till annnonsören om varför nekades sen?
      const updatedAd: Ad = {
        ...selectedAd,
        isPublic: false,
        isReviewed: true,
      };
      dispatch(updateAdAsync({ adId: selectedAd.id, updates: updatedAd }));
      navigate("/admin-adlist");
    }
  };

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
        backgroundColor: "#510102",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Text color="error">{error}</Text>
      ) : selectedAd ? (
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: "1400px",
            backgroundColor: "#fffaeb",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Titel och plats */}
          <Grid item xs={12}>
            <Text
              variant="h3"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#510102" }}
            >
              {selectedAd.title}
            </Text>
            <Text variant="h6" sx={{ color: "#510102" }}>
              Swishnummer: {selectedAd.swishNumber}
            </Text>
            <Text variant="h6" sx={{ color: "#510102" }}>
              Plats: {selectedAd.location}
            </Text>
            <Link
              href={`profile/${selectedAd.profileId}`}
              sx={{ textDecoration: "none" }}
            >
              <Text variant="h6" sx={{ color: "#510102" }}>
                Om annonsören
              </Text>
            </Link>
          </Grid>

          {/* Huvudinnehåll */}
          <Grid item xs={12} md={8}>
            <Text variant="body1" paragraph sx={{ color: "#510102" }}>
              {selectedAd.description}
            </Text>

            {selectedAd.numberOfHives ? (
              <>
                <Text variant="h5" sx={{ marginTop: "2rem", color: "#510102" }}>
                  Information för biodlare
                </Text>
                <Text variant="body1">
                  Antal bikupor: {selectedAd.numberOfHives}
                </Text>
              </>
            ) : selectedAd.areaSize ? (
              <>
                <Text variant="h5" sx={{ marginTop: "2rem", color: "#510102" }}>
                  Information för markägare
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Markyta: {selectedAd.areaSize} hektar
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Grödor: {selectedAd.crops || "Ej specificerat"}
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Använder besprutning: {selectedAd.spraying ? "Ja" : "Nej"}
                </Text>
                <Text variant="body1" sx={{ color: "#510102" }}>
                  Använder gödsel:{" "}
                  {selectedAd.fertilization || "Ej specificerat"}
                </Text>
              </>
            ) : null}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: "#510102",
                padding: "2rem",
                borderRadius: "12px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  marginTop: "1.5rem",
                  backgroundColor: "#fffaeb",
                  padding: "0.75rem 1.5rem",
                  // "&:hover": {
                  //   backgroundColor: "#cc8500",
                  // },
                }}
                onClick={handleAcceptAd}
              >
                <Text sx={{ color: "#510102" }}>Godkänn annons</Text>
              </Button>
              <Button
                variant="contained"
                sx={{
                  marginTop: "1.5rem",
                  backgroundColor: "#fffaeb",
                  padding: "0.75rem 1.5rem",
                  // "&:hover": {
                  //   backgroundColor: "#cc8500",
                  // },
                }}
                onClick={handleDeclineAd}
              >
                <Text sx={{ color: "#510102" }}>Neka annons</Text>
              </Button>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Text variant="h6">Ingen annons hittades.</Text>
      )}
    </Box>
  );
};

export default AdminAdDetailPage;
