import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../Components/Loading";
import { deleteAdAsync, getAllAdsAsync } from "../SLICES/adSlice";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import {
  deleteUserAsync,
  getProfileByIdAsync,
  updateUserPresentationAsync,
} from "../SLICES/userSlice";
import { Ad, Profile } from "../types";
import { Rubrik, Text } from "./Index";
import { RedBorderTextfield } from "./Register";

export default function ProfilePage() {
  const { id } = useParams(); // Få ID från URL:en
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user); // Inloggad användare
  const myAds = useAppSelector((state) => state.adSlice.ads).filter(
    (ad) => ad.profileId == user?.id
  );
  const activeProfile = useAppSelector(
    (state) => state.userSlice.activeProfile
  ); // Aktiv profil (annans data)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isOwnProfile = !id || id === user?.id;
  const [avatar, setAvatar] = useState<string | null>(
    isOwnProfile && user?.profileImage
      ? user.profileImage
      : "/default-avatar.png"
  );
  const setImageFile = useState<File | null>()[1];

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
      dispatch(getProfileByIdAsync(id));
      dispatch(getAllAdsAsync());
    } else {
      // Annars använd den inloggade användarens data
      setName(user?.username || "");
      setCity(user?.cityName || "");
      setRole(user?.role || "");
      setDesc(user?.profileDescription || "");
    }
  }, [id, user, dispatch]);

  const currentProfile = id ? activeProfile : user;

  if (id && !currentProfile) {
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

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const handleSave = () => {
    console.log("UPPDATERAD: ", user, name, city, role);
    if (user && name && role) {
      const updatedProfile: Profile = {
        ...user,
        username: name,
        role: role,
        profileDescription: desc,
        shareLocation: shareLoc,
        profileImage: avatar ?? user.profileImage,
      };
      console.log("UPPDATERAD: ", updatedProfile);
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

  const handleDeleteAd = async (ad: Ad) => {
    if (
      window.confirm(
        `Är du säker på att du vill radera din annons ${ad.title}? Denna åtgärd kan inte ångras.`
      )
    ) {
      await dispatch(deleteAdAsync(ad.id));
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
        backgroundColor: "#510102",
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
          backgroundColor: "#fffaeb",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {editMode ? (
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
        ) : (
          <Avatar
            src={currentProfile?.profileImage || "/default-avatar.png"}
            alt={currentProfile?.username}
            sx={{
              width: "120px",
              height: "120px",
              border: "4px solid #510102",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {editMode ? (
            <RedBorderTextfield
              label="Namn"
              value={name}
              onChange={handleChange(setName)}
              fullWidth
            />
          ) : (
            <Rubrik
              sx={{ fontSize: isMobile ? "1.5rem" : "2rem", color: "#510102" }}
            >
              {currentProfile?.username}
            </Rubrik>
          )}
          {editMode ? (
            <RadioGroup
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
          ) : (
            <Text sx={{ fontSize: 18, color: "#510102" }}>
              {currentProfile?.role}
            </Text>
          )}
          <Text sx={{ fontSize: 18, color: "#510102" }}>
            {currentProfile?.cityName}
          </Text>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#fffaeb",
          borderRadius: "8px",
          padding: "2rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Rubrik sx={{ marginBottom: "1rem", color: "#510102" }}>Om mig</Rubrik>
        {editMode ? (
          <RedBorderTextfield
            label="Beskrivning"
            value={desc}
            multiline
            onChange={handleChange(setDesc)}
            fullWidth
          />
        ) : (
          <Text
            sx={{
              color: "#510102",
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
        ) : (
          isOwnProfile && (
            // <Text>
            //   {currentProfile?.shareLocation
            //     ? "Du har valt att andra kan söka på din plats."
            //     : "Du har valt att andra inte kan söka på din plats."}{" "}
            // </Text>
            <Box
              sx={{
                width: "100%",
                maxWidth: "800px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 3,
              }}
            >
              <Rubrik sx={{ color: "#510102", textAlign: "center" }}>
                Mina annonser
              </Rubrik>

              {myAds.length === 0 ? (
                <Text sx={{ textAlign: "center", color: "#510102" }}>
                  Du har inga aktiva annonser.
                </Text>
              ) : (
                myAds.map((ad) => (
                  <Box
                    key={ad.id}
                    sx={{
                      backgroundColor: "#fffaeb",
                      borderRadius: "8px",
                      padding: "1.5rem",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      position: "relative",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        color: "#510102",
                      }}
                    >
                      {ad.title}
                    </Text>
                    <Text sx={{ color: "#510102", whiteSpace: "pre-line" }}>
                      {ad.description}
                    </Text>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteAd(ad)}
                      sx={{
                        alignSelf: "flex-end",
                        borderColor: "#510102",
                        color: "#510102",
                        "&:hover": {
                          backgroundColor: "rgba(255, 87, 51, 0.1)",
                        },
                      }}
                    >
                      Radera annons
                    </Button>
                  </Box>
                ))
              )}
            </Box>
          )
        )}
      </Box>

      {isOwnProfile && (
        <>
          <Button
            variant="contained"
            sx={{
              marginTop: "2rem",
              backgroundColor: "#fffaeb",
              color: "#510102",
            }}
            onClick={() => (editMode ? handleSave() : setIsEditMode(true))}
          >
            <Text>{editMode ? "Spara ändringar" : "Redigera profil"}</Text>
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              marginTop: "1rem",
              borderColor: "#fffaeb",
              color: "#fffaeb",
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
