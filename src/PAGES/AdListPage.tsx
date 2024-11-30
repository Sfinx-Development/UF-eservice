import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAdsAsync, setSelectedAd } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";
import { Rubrik, Text } from "./Index";
import { RedBorderTextfield } from "./Register";

const AdListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ads = useAppSelector((state) => state.adSlice.ads);
  const error = useAppSelector((state) => state.adSlice.error);
  const loading = useAppSelector((state) => state.adSlice.loading);

  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [adTypeFilter, setAdTypeFilter] = useState("");

  useEffect(() => {
    dispatch(getAllAdsAsync());
  }, []);

  useEffect(() => {
    let filtered: Ad[] = ads;

    if (searchTerm) {
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((ad) =>
        ad.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (adTypeFilter) {
      filtered = filtered.filter((ad) =>
        adTypeFilter === "bikupor" ? ad.numberOfHives : ad.areaSize
      );
    }

    setFilteredAds(filtered);
  }, [searchTerm, locationFilter, adTypeFilter, ads]);

  const handleNavigateToAd = (ad: Ad) => {
    dispatch(setSelectedAd(ad));
    navigate("/addetail");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocationFilter(e.target.value);
  };

  const handleAdTypeFilterChange = (event: SelectChangeEvent<string>) => {
    setAdTypeFilter(event.target.value as string);
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
        backgroundColor: "#fffaeb",
      }}
    >
      <Rubrik variant="h4" gutterBottom sx={{ color: "#510102" }}>
        Sök och filtrera annonser
      </Rubrik>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "800px",
          marginBottom: "2rem",
        }}
      >
        <RedBorderTextfield
          label="Sök efter titel eller beskrivning"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />

        <RedBorderTextfield
          label="Filtrera på plats"
          variant="outlined"
          value={locationFilter}
          onChange={handleLocationFilterChange}
          fullWidth
        />

        <FormControl
          sx={{
            "& .MuiInputLabel-root": {
              color: "#510102",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#510102",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#510102",
              },
              "&:hover fieldset": {
                borderColor: "#510102",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#510102",
              },
            },
          }}
          fullWidth
        >
          <InputLabel>Filtrera efter typ av annons</InputLabel>
          <Select
            value={adTypeFilter}
            onChange={handleAdTypeFilterChange}
            label="Filtrera efter typ av annons"
          >
            <MenuItem value="">Alla</MenuItem>
            <MenuItem value="bikupor">Bikupor</MenuItem>
            <MenuItem value="mark">Markägare</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Text>Laddar annonser...</Text>
      ) : error ? (
        <Text color="error">{error}</Text>
      ) : filteredAds && filteredAds.length > 0 ? (
        <Grid container spacing={2}>
          {filteredAds.map((ad) => (
            <Grid item xs={12} sm={6} md={4} key={ad.id}>
              <Card sx={{ backgroundColor: "#510102", borderRadius: "8px" }}>
                <CardContent>
                  <Text variant="h6" sx={{ color: "#fffaeb" }}>
                    {ad.title}
                  </Text>
                  <Text sx={{ marginBottom: "1rem", color: "#fffaeb" }}>
                    {ad.location}
                  </Text>
                  <Text variant="body2" sx={{ color: "#fffaeb" }}>
                    {ad.description}
                  </Text>
                </CardContent>
                <CardActionArea onClick={() => handleNavigateToAd(ad)}>
                  <Text sx={{ padding: "1rem", color: "#fffaeb" }}>
                    Till annonsen
                  </Text>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Text variant="h6">Inga annonser hittades.</Text>
      )}
    </Box>
  );
};

export default AdListPage;
