import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch } from "../SLICES/store";
import { addUserAsync } from "../SLICES/userSlice";
import { UserCreate } from "../types";

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formValues, setFormValues] = useState<UserCreate>({
    email: "",
    phone: "",
    username: "",
    password: "",
    address: "",
    profileDescription: "",
    role: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    role: false,
    termsAccepted: false,
    phone: false,
    address: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("KÖR");
  //   dispatch(addUserAsync(formValues));
  // };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust regex based on your phone format
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      role: false,
      termsAccepted: false,
      phone: false,
      address: false,
    };

    if (!formValues.role) {
      newErrors.role = true;
      hasErrors = true;
    }
    if (!formValues.termsAccepted) {
      newErrors.termsAccepted = true;
      hasErrors = true;
    }
    if (!validatePhone(formValues.phone)) {
      newErrors.phone = true;
      hasErrors = true;
    }
    if (!formValues.address.trim()) {
      newErrors.address = true;
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      dispatch(addUserAsync(formValues));
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
        padding: isMobile ? "1rem" : "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Typography variant={isMobile ? "h4" : "h3"} gutterBottom>
        Registrera dig
      </Typography>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "50%",
          gap: "1rem",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="E-post"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Telefonnummer"
          type="tel"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          required
          fullWidth
          error={errors.phone}
          helperText={errors.phone ? "Ogiltigt telefonnummer" : ""}
        />
        <TextField
          label="Användarnamn"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Lösenord"
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Adress"
          name="address"
          value={formValues.address}
          onChange={handleChange}
          required
          fullWidth
          error={errors.address}
          helperText={errors.address ? "Adress kan inte vara tom" : ""}
        />
        <TextField
          label="Profilbeskrivning (valfritt)"
          name="profileDescription"
          value={formValues.profileDescription}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl component="fieldset" error={errors.role}>
          <FormLabel component="legend">Roll</FormLabel>
          <RadioGroup
            name="role"
            value={formValues.role}
            onChange={handleChange}
          >
            <FormControlLabel
              value="biodlare"
              control={<Radio />}
              label="Biodlare"
            />
            <FormControlLabel
              value="markägare"
              control={<Radio />}
              label="Markägare"
            />
            <FormControlLabel value="båda" control={<Radio />} label="Båda" />
          </RadioGroup>
          {errors.role && <FormHelperText>Välj en roll</FormHelperText>}
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              checked={formValues.termsAccepted}
              onChange={handleChange}
              required
            />
          }
          label="Jag godkänner användarvillkoren"
        />
        {errors.termsAccepted && <FormHelperText error></FormHelperText>}

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
          Registrera dig
        </Button>
      </Box>
    </Box>
  );
};

export default RegisterPage;
