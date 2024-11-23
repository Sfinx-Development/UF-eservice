import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../Components/Loading";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import {
  deleteUserAsync,
  getProfileByIdAsync,
  updateUserPresentationAsync,
} from "../SLICES/userSlice";
import { Profile } from "../types";
import { Rubrik, Text } from "./Index";

export default function ProfilePage() {
  const { id } = useParams(); // Få ID från URL:en
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user); // Inloggad användare
  const activeProfile = useAppSelector(
    (state) => state.userSlice.activeProfile
  ); // Aktiv profil (annans data)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [editMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const [shareLoc, setShareLoc] = useState<boolean>(
    user?.shareLocation || false
  );

  // Hämta profildata baserat på ID
  useEffect(() => {
    if (id) {
      // Om ID finns, hämta annans profil
      dispatch(getProfileByIdAsync(id));
    } else {
      // Annars använd den inloggade användarens data
      setName(user?.username || "");
      setCity(user?.city || "");
      setRole(user?.role || "");
      setDesc(user?.profileDescription || "");
    }
  }, [id, user, dispatch]);

  // Kontrollera aktuell profil som visas
  const currentProfile = id ? activeProfile : user;

  if (id && !currentProfile) {
    // Visa laddningsindikator tills `activeProfile` är laddad
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <LoadingIndicator />
      </Box>
    );
  }

  const isOwnProfile = !id || id === user?.id;

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleSave = () => {
    if (user && name && city && role) {
      const updatedProfile: Profile = {
        ...user,
        username: name,
        city: city,
        role: role,
        profileDescription: desc,
        shareLocation: shareLoc,
      };
      dispatch(updateUserPresentationAsync(updatedProfile));
      setIsEditMode(false);
    }
  };
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Är du säker på att du vill radera all din data? Denna åtgärd kan inte ångras."
      )
    ) {
      dispatch(deleteUserAsync());
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
      {/* Profilinformation */}
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
          alt={currentProfile?.username}
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
              value={name}
              onChange={handleChange(setName)}
              fullWidth
            />
          ) : (
            <Rubrik sx={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>
              {currentProfile?.username}
            </Rubrik>
          )}
          <Text sx={{ fontSize: 18 }}>{currentProfile?.role}</Text>
          <Text sx={{ fontSize: 18 }}>{currentProfile?.city}</Text>
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
            value={desc}
            multiline
            onChange={handleChange(setDesc)}
            fullWidth
          />
        ) : (
          <Text
            sx={{
              color: "#555",
              marginBottom: "1.5rem",
              textAlign: "justify",
              whiteSpace: "pre-line",
            }}
          >
            {currentProfile?.profileDescription}
          </Text>
        )}
        {editMode ? (
          <FormControlLabel
            control={
              <Checkbox
                name="shareLocation"
                checked={shareLoc}
                onChange={(e) => setShareLoc(e.target.checked)}
              />
            }
            label="Tillåt att andra kan söka på min plats"
          />
        ) : (
          isOwnProfile && (
            <Text>
              {currentProfile?.shareLocation
                ? "Du har valt att andra kan söka på din plats."
                : "Du har valt att andra inte kan söka på din plats."}{" "}
            </Text>
          )
        )}
      </Box>

      {isOwnProfile && (
        <>
          <Button
            variant="contained"
            sx={{
              marginTop: "2rem",
              backgroundColor: "#FFA500",
              color: "#FFF",
            }}
            onClick={() => (editMode ? handleSave() : setIsEditMode(true))}
          >
            {editMode ? "Spara ändringar" : "Redigera profil"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              marginTop: "1rem",
              borderColor: "#FF5733",
              color: "#FF5733",
              "&:hover": {
                backgroundColor: "rgba(255, 87, 51, 0.1)",
              },
            }}
            onClick={handleDeleteAccount}
          >
            Radera konto och all data
          </Button>
        </>
      )}
    </Box>
  );
}
