import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  FormHelperText
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAdAsync } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";

const NewAdPage: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    location: "",
    numberOfHives: "",
    crops: "",
    areaSize: "",
    spraying: "no",
    fertilization: "none",
  });

  const [errors, setErrors] = useState({
    title: false,
    location: false,
    numberOfHives: false,
    areaSize: false,
    crops: false,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // För att hantera Snackbar

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      title: false,
      location: false,
      numberOfHives: false,
      areaSize: false,
      crops: false,
    };

    let hasErrors = false;

    // Check required fields
    if (!formValues.title) {
      newErrors.title = true;
      hasErrors = true;
    }
    if (!formValues.location) {
      newErrors.location = true;
      hasErrors = true;
    }
    if (user?.role === "biodlare" && !formValues.numberOfHives) {
      newErrors.numberOfHives = true;
      hasErrors = true;
    }
    if (user?.role === "markägare") {
      if (!formValues.areaSize) {
        newErrors.areaSize = true;
        hasErrors = true;
      }
      if (!formValues.crops) {
        newErrors.crops = true;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (!hasErrors && user) {
      const ad: Ad = {
        ...formValues,
        id: "undefined",
        profileId: user.id,
      };
      dispatch(addAdAsync(ad));

      // Show success message
      setSnackbarOpen(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500); // Wait 1.5 seconds
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (user) {
  //     const ad: Ad = {
  //       ...formValues,
  //       id: "undefined",
  //       profileId: user.id,
  //     };
  //     dispatch(addAdAsync(ad));

  //     // Visa meddelande att annonsen skapades
  //     setSnackbarOpen(true);

  //     // Navigera till dashboard efter en kort tidsfördröjning
  //     setTimeout(() => {
  //       navigate("/dashboard");
  //     }, 1500); // Vänta 1,5 sekunder
  //   }
  // };

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
      <Typography variant="h4" gutterBottom>
        {user?.role === "biodlare"
          ? "Skapa annons - Ställa ut bikupor"
          : "Skapa annons - Söka efter bikupor"}
      </Typography>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          gap: "1rem",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Titel"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          required
          error={errors.title}
          helperText={errors.title ? "Titel är obligatorisk" : ""}
          fullWidth
        />
        <TextField
          label="Beskrivning"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          label="Plats"
          name="location"
          value={formValues.location}
          onChange={handleChange}
          required
          error={errors.location}
          helperText={errors.location ? "Plats är obligatorisk" : ""}
          fullWidth
        />

        {/* Biodlare-formulär */}
        {user?.role === "biodlare" && (
          <TextField
            label="Hur många bikupor vill du ställa ut?"
            name="numberOfHives"
            value={formValues.numberOfHives}
            onChange={handleChange}
            required
            error={errors.numberOfHives}
            helperText={errors.numberOfHives ? "Ange antal bikupor" : ""}
            fullWidth
          />
        )}

        {/* Markägare-formulär */}
        {user?.role === "markägare" && (
          <>
            <TextField
              label="Hur mycket mark har du som ska pollineras?"
              name="areaSize"
              value={formValues.areaSize}
              onChange={handleChange}
              required
              error={errors.areaSize}
              helperText={errors.areaSize ? "Ange storlek på mark" : ""}
              fullWidth
            />
            <TextField
              label="Vilka grödor odlar du?"
              name="crops"
              value={formValues.crops}
              onChange={handleChange}
              required
              error={errors.crops}
              helperText={errors.crops ? "Ange grödor" : ""}
              fullWidth
            />
            <Typography variant="h6">Användning av kemikalier:</Typography>
            <RadioGroup
              name="spraying"
              value={formValues.spraying}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Jag besprutar min mark"
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="Jag besprutar inte min mark"
              />
            </RadioGroup>

            <Typography variant="h6">Gödsling:</Typography>
            <RadioGroup
              name="fertilization"
              value={formValues.fertilization}
              onChange={handleChange}
            >
              <FormControlLabel
                value="chemical"
                control={<Radio />}
                label="Jag gödslar med konstgödsel"
              />
              <FormControlLabel
                value="natural"
                control={<Radio />}
                label="Jag gödslar med naturlig gödsel"
              />
              <FormControlLabel
                value="none"
                control={<Radio />}
                label="Jag använder ingen gödsling"
              />
            </RadioGroup>
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#FFA500",
            "&:hover": {
              backgroundColor: "#cc8500",
            },
          }}
          fullWidth
        >
          Skicka annons
        </Button>
      </Box>

      {/* Snackbar för bekräftelse */}
      <Snackbar
        open={snackbarOpen}
        message="Annonsen skapades framgångsrikt!"
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default NewAdPage;
