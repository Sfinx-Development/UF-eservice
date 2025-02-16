import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { addUserAsync } from "../SLICES/userSlice";
import { UserCreate } from "../types";
import { Rubrik, Text } from "./Index";

export const RedBorderTextfield = styled(TextField)`
  & label.Mui-focused {
    color: #510102;
  }
  &:hover fieldset {
    border-color: #510102;
  }
  &.Mui-focused fieldset {
    border-color: #510102;
  }
  & .MuiInput-underline:after {
    border-bottom-color: #510102;
  }
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #510102;
    }
    &.Mui-focused fieldset {
      border-color: #510102;
    }
  }
  & label.Mui-focused {
    color: #510102;
  }
`;

export default function RegisterPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>("/default-avatar.png");
  const setImageFile = useState<File | null>()[1];
  const createAccountError = useAppSelector(
    (state) => state.userSlice.createAccountError
  );

  const [formValues, setFormValues] = useState<UserCreate>({
    email: "",
    username: "",
    password: "",
    password2: "",
    profileDescription: "",
    role: "",
    termsAccepted: false,
    shareLocation: false,
    cityName: "",
    isAdmin: false,
    profileImage: "",
  });

  const [errors, setErrors] = useState({
    role: false,
    termsAccepted: false,
    shareLocation: false,
    city: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      role: false,
      termsAccepted: false,
      shareLocation: false,
      city: false,
      password: false,
    };

    if (!formValues.role) {
      newErrors.role = true;
      hasErrors = true;
    }
    if (formValues.password !== formValues.password2) {
      newErrors.password = true;
      hasErrors = true;
    }
    if (!formValues.termsAccepted) {
      newErrors.termsAccepted = true;
      hasErrors = true;
    }
    if (!formValues.cityName.trim()) {
      newErrors.city = true;
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      if (avatar) {
        const profileData = {
          ...formValues,
          profileImage: avatar,
        };
        const resultAction = await dispatch(addUserAsync(profileData));

        if (addUserAsync.fulfilled.match(resultAction)) {
          // Om lyckad registrering, navigera till inloggning
          navigate("/login");
        }
      }
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
        backgroundColor: "#510102",
      }}
    >
      <Rubrik
        variant={isMobile ? "h4" : "h3"}
        sx={{ color: "#fffaeb" }}
        gutterBottom
      >
        Registrera dig
      </Rubrik>
      <Box sx={{ marginBottom: 2 }}>
        <Text sx={{ color: "#fffaeb" }}>
          Genom att registrera dig godkänner du att vi behandlar dina
          personuppgifter enligt vår{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            style={{ color: "#fffaeb" }}
          >
            integritetspolicy
          </a>
          .
        </Text>
        {createAccountError && (
          <Text sx={{ color: "#fffaeb", fontSize: 20, backgroundColor: "red" }}>
            {createAccountError}
          </Text>
        )}
      </Box>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : "50%",
          gap: "1rem",
          backgroundColor: "#fffaeb",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <RedBorderTextfield
          label="E-post"
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <RedBorderTextfield
          label="Användarnamn"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <RedBorderTextfield
          label="Lösenord"
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          required
          fullWidth
        />
        <RedBorderTextfield
          label="Bekräfta Lösenord"
          type="password"
          name="password2"
          value={formValues.password2}
          onChange={handleChange}
          required
          fullWidth
        />
        <RedBorderTextfield
          label="Stad"
          name="cityName"
          value={formValues.cityName}
          onChange={handleChange}
          required
          fullWidth
          error={errors.city}
          helperText={errors.city ? "Stad kan inte vara tom" : ""}
        />
        <RedBorderTextfield
          label="Profilbeskrivning (valfritt)"
          name="profileDescription"
          value={formValues.profileDescription}
          onChange={handleChange}
          multiline
          rows={4}
          fullWidth
        />

        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <FormControl component="fieldset" error={errors.role}>
              <FormLabel
                component="legend"
                sx={{
                  color: "#510102",
                  "&.Mui-focused": {
                    color: "#510102",
                  },
                }}
              >
                Jag är
              </FormLabel>
              <RadioGroup
                name="role"
                value={formValues.role}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="biodlare"
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
                  label="Biodlare"
                />
                <FormControlLabel
                  value="markägare"
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
                  label="Markägare"
                />
                <FormControlLabel
                  value="båda"
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
                  label="Båda"
                />
              </RadioGroup>
              {errors.role && <FormHelperText>Välj en roll</FormHelperText>}
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <label htmlFor="profile-image-upload" style={{ cursor: "pointer" }}>
              <Avatar
                src={avatar || "/default-avatar.png"}
                alt={"ProfileImage/avatar"}
                sx={{
                  width: "120px",
                  height: "120px",
                  border: "4px solid #510102",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
            </label>
            <div>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ padding: 2, color: "#510102" }}
              />
            </div>
          </Box>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              checked={formValues.termsAccepted}
              onChange={handleChange}
              required
              sx={{
                color: "#510102",
                "&.Mui-checked": {
                  color: "#510102",
                },
              }}
            />
          }
          label={
            <>
              Jag godkänner{" "}
              <a href="/terms" target="_blank" style={{ color: "#510102" }}>
                användarvillkoren
              </a>{" "}
              och{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                style={{ color: "#510102" }}
              >
                integritetspolicyn
              </a>
              .
            </>
          }
        />

        <FormControlLabel
          control={
            <Checkbox
              name="shareLocation"
              checked={formValues.shareLocation || false}
              onChange={handleChange}
              sx={{
                color: "#510102",
                "&.Mui-checked": {
                  color: "#510102",
                },
              }}
            />
          }
          label="Tillåt att andra kan söka på min plats"
        />

        {errors.termsAccepted && <FormHelperText error></FormHelperText>}

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#510102",
            "&:hover": {
              backgroundColor: "#6B2020",
            },
          }}
          fullWidth
        >
          <Text>Registrera dig</Text>
        </Button>
      </Box>
    </Box>
  );
}
