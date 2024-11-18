import { Box, Card, CardActionArea, CardContent, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreviewedAdsAsync, setSelectedAd } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";
import { Text } from "./Index";

const AdminAdListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.adSlice.error);
  const loading = useAppSelector((state) => state.adSlice.loading);
  const ads = useAppSelector((state) => state.adSlice.unreviewedAds);

  useEffect(() => {
    dispatch(getUnreviewedAdsAsync());
  }, []);

  const handleNavigateToAd = (ad: Ad) => {
    console.log("AD: ", ad);
    dispatch(setSelectedAd(ad));
    navigate("/admin-addetail");
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
        backgroundColor: "#f7f7f7",
      }}
    >
      {loading ? (
        <Text>Laddar annonser...</Text>
      ) : error ? (
        <Text color="error">{error}</Text>
      ) : ads && ads.length > 0 ? (
        <Grid container spacing={2}>
          {ads.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ backgroundColor: "#fff", borderRadius: "8px" }}>
                <CardContent>
                  <Text variant="h6">{ad.title}</Text>
                  <Text sx={{ marginBottom: "1rem", color: "#777" }}>
                    {ad.location}
                  </Text>
                  <Text variant="body2" color="text.secondary">
                    {ad.description}
                  </Text>
                </CardContent>
                <CardActionArea onClick={() => handleNavigateToAd(ad)}>
                  <Text sx={{ padding: "1rem", color: "#FFA500" }}>
                    Till annonsen
                  </Text>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Text variant="h6">Inga ogranskade annonser.</Text>
      )}
    </Box>
  );
};

export default AdminAdListPage;
