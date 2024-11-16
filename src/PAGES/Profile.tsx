import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import {
  getProfileByIdAsync,
  updateUserPresentationAsync,
} from "../SLICES/userSlice";
import { Profile } from "../types";
import { Rubrik, Text } from "./Index";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const activeProfile = useAppSelector(
    (state) => state.userSlice.activeProfile
  );

  const [editMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");

  // Hämta profil-data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id && id !== user?.id) {
          dispatch(getProfileByIdAsync(id));
        } else {
          setName(user?.username || "");
          setCity(user?.city || "");
          setRole(user?.role || "");
          setDesc(user?.profileDescription || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id, user]);

  const profileImages = user?.profileImages || [];

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleSave = () => {
    if (user && name != "" && city != "" && role != "" && desc != "") {
      const updatedProfile: Profile = {
        ...user,
        username: name,
        city: city,
        role: role,
        profileDescription: desc,
      };
      dispatch(updateUserPresentationAsync(updatedProfile));
      setIsEditMode(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        minHeight: "100vh",
        width: "100%",
        padding: isMobile ? "1rem" : "2rem",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "center",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "800px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar
          src={"/default-avatar.png"}
          alt={activeProfile?.username || user?.username}
          sx={{
            width: "120px",
            height: "120px",
            border: "4px solid #FFA500",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {editMode ? (
            <TextField
              label="Namn"
              type="name"
              name="namme"
              value={name}
              onChange={handleChange(setName)}
              required
              fullWidth
            />
          ) : (
            <Rubrik sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>
              {activeProfile?.username || user?.username}
            </Rubrik>
          )}

          {editMode ? (
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {activeProfile?.role || user?.role}
              </FormLabel>
              <RadioGroup
                name="role"
                value={role}
                onChange={handleChange(setRole)}
              >
                <FormControlLabel
                  value="Biodlare"
                  control={<Radio />}
                  label="Biodlare"
                />
                <FormControlLabel
                  value="Markägare"
                  control={<Radio />}
                  label="Markägare"
                />
                <FormControlLabel
                  value="Biodlare och Markägare"
                  control={<Radio />}
                  label="Båda"
                />
              </RadioGroup>
            </FormControl>
          ) : (
            <Text sx={{ fontSize: 18 }}>
              {activeProfile?.role || user?.role}
            </Text>
          )}

          {editMode ? (
            <TextField
              label="Stad"
              type="city"
              name="city"
              value={city}
              onChange={handleChange(setCity)}
              required
              fullWidth
            />
          ) : (
            <Text sx={{ fontSize: 18 }}>
              {activeProfile?.city || user?.city}
            </Text>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Rubrik sx={{ marginBottom: "1rem" }}>Om mig</Rubrik>

        {editMode ? (
          <TextField
            label="Beskrivning"
            type="description"
            name="description"
            value={desc}
            onChange={handleChange(setDesc)}
            required
            fullWidth
          />
        ) : (
          <Text
            sx={{
              color: "#555",
              marginBottom: "1.5rem",
              textAlign: "justify",
              whiteSpace: "pre-line", // Bevara radbrytningar och mellanslag
            }}
          >
            {activeProfile?.profileDescription || user?.profileDescription}
          </Text>
        )}

        {profileImages.length > 0 && (
          <Grid container spacing={2}>
            {profileImages.slice(0, 4).map((image: string, index: number) => (
              <Grid item xs={6} sm={4} key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`Profile image ${index + 1}`}
                  sx={{
                    width: "100%",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {!activeProfile && user && (
        <Button
          variant="contained"
          sx={{
            marginTop: "2rem",
            backgroundColor: "#FFA500",
            color: "#FFF",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#cc8500",
            },
          }}
          onClick={() => (editMode ? handleSave() : setIsEditMode(true))}
        >
          <Text>{editMode ? "Spara ändringar" : "Redigera profil"}</Text>
        </Button>
      )}
    </Box>
  );
}
