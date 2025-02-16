import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SwishPaymentPopup from "../Components/SwishPaymentPopup";
import { addAdAsync } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { Ad } from "../types";
import { Rubrik, Text } from "./Index";
import { RedBorderTextfield } from "./Register";

const NewAdPage: React.FC = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    cityName: "",
    numberOfHives: "",
    crops: "",
    areaSize: "",
    spraying: "no",
    fertilization: "none",
  });

  const [errors, setErrors] = useState({
    title: false,
    cityName: false,
    numberOfHives: false,
    areaSize: false,
    crops: false,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    const newErrors = {
      title: false,
      cityName: false,
      numberOfHives: false,
      areaSize: false,
      crops: false,
    };

    let hasErrors = false;

    if (!formValues.title) {
      newErrors.title = true;
      hasErrors = true;
    }
    if (!formValues.cityName) {
      newErrors.cityName = true;
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
      setOpenModal(true);
    }
  };

  // useEffect(() => {
  //  dispatch(getCoordinatesAsync(formValues.location));
  // },[formValues.location])

  const handleSubmit = (e: React.FormEvent, swishNumber: string) => {
    e.preventDefault();

    if (user && swishNumber != "") {
      const ad: Ad = {
        ...formValues,
        id: "undefined",
        profileId: user.id,
        isReviewed: false,
        isPublic: false,
        swishNumber: swishNumber,
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
        // backgroundColor: "#fffaeb",
        background: "url(https://i.imgur.com/o6I6C94.png)",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={() => navigate("/dashboard")}
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            textAlign: { xs: "start", md: "center" },
            justifyContent: "center",
            position: "absolute",
            left: { xs: 10, md: 50 },
          }}
        >
          <ArrowBackIcon sx={{ color: "#510102", marginBottom: 0.5 }} />
        </IconButton>
        <Rubrik
          variant="h4"
          gutterBottom
          sx={{ color: "#fffaeb", textAlign: "center" }}
        >
          {user?.role === "biodlare"
            ? "Skapa annons - Ställa ut bikupor"
            : "Skapa annons - Söka efter bikupor"}
        </Rubrik>
      </Box>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "600px",
          gap: "1rem",
          backgroundColor: "#fffaeb",
          padding: "2rem",
          borderRadius: "8px",
          // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <RedBorderTextfield
          label="Titel"
          name="title"
          value={formValues.title}
          onChange={handleChange}
          required
          error={errors.title}
          helperText={errors.title ? "Titel är obligatorisk" : ""}
          fullWidth
        />
        <RedBorderTextfield
          label="Beskrivning"
          name="description"
          value={formValues.description}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />
        <RedBorderTextfield
          label="Stad"
          name="cityName"
          value={formValues.cityName}
          onChange={handleChange}
          required
          error={errors.cityName}
          helperText={errors.cityName ? "Plats är obligatorisk" : ""}
          fullWidth
        />

        {/* Biodlare-formulär */}
        {user?.role === "biodlare" && (
          <RedBorderTextfield
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
            <RedBorderTextfield
              label="Hur mycket mark har du som ska pollineras?"
              name="areaSize"
              value={formValues.areaSize}
              onChange={handleChange}
              required
              error={errors.areaSize}
              helperText={errors.areaSize ? "Ange storlek på mark" : ""}
              fullWidth
            />
            <RedBorderTextfield
              label="Vilka grödor odlar du?"
              name="crops"
              value={formValues.crops}
              onChange={handleChange}
              required
              error={errors.crops}
              helperText={errors.crops ? "Ange grödor" : ""}
              fullWidth
            />
            <Text variant="h6">Användning av kemikalier:</Text>
            <RadioGroup
              name="spraying"
              value={formValues.spraying}
              onChange={handleChange}
            >
              <FormControlLabel
                value="yes"
                control={
                  <Radio
                    sx={{
                      color: "#510102",
                      "&.Mui-checked": {
                        color: "#510102",
                      },
                    }}
                  />
                }
                label="Jag besprutar min mark"
              />
              <FormControlLabel
                value="no"
                control={
                  <Radio
                    sx={{
                      color: "#510102",
                      "&.Mui-checked": {
                        color: "#510102",
                      },
                    }}
                  />
                }
                label="Jag besprutar inte min mark"
              />
            </RadioGroup>

            <Text variant="h6">Gödsling:</Text>
            <RadioGroup
              name="fertilization"
              value={formValues.fertilization}
              onChange={handleChange}
            >
              <FormControlLabel
                value="chemical"
                control={
                  <Radio
                    sx={{
                      color: "#510102",
                      "&.Mui-checked": {
                        color: "#510102",
                      },
                    }}
                  />
                }
                label="Jag gödslar med konstgödsel"
              />
              <FormControlLabel
                value="natural"
                control={
                  <Radio
                    sx={{
                      color: "#510102",
                      "&.Mui-checked": {
                        color: "#510102",
                      },
                    }}
                  />
                }
                label="Jag gödslar med naturlig gödsel"
              />
              <FormControlLabel
                value="none"
                control={
                  <Radio
                    sx={{
                      color: "#510102",
                      "&.Mui-checked": {
                        color: "#510102",
                      },
                    }}
                  />
                }
                label="Jag använder ingen gödsling"
              />
            </RadioGroup>
          </>
        )}
        {openModal && (
          <SwishPaymentPopup
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            onConfirmPayment={handleSubmit}
            handleAbort={() => setOpenModal(false)}
          />
        )}
        <Button
          onClick={handleOpenModal}
          variant="contained"
          sx={{
            backgroundColor: "#510102",
            "&:hover": {
              backgroundColor: "#6B2020",
            },
          }}
          fullWidth
        >
          <Text>Skicka annons</Text>
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
