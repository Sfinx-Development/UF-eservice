import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../SLICES/store";
import { logInUserAsync } from "../SLICES/userSlice";
import { LogIn } from "../types";

export default function Login() {
  const error = useAppSelector((state) => state.userSlice.logInError);
  const user = useAppSelector((state) => state.userSlice.user);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [keepAlive, setKeepAlive] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSignIn = async () => {
    try {
      const login: LogIn = {
        email: email,
        password: password,
        keepAlive: keepAlive,
      };
      await dispatch(logInUserAsync(login));
      setSignedIn(true);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  useEffect(() => {
    if (user && !error && signedIn) {
      navigate("/dashboard");
    }
  }, [user, signedIn, error, navigate]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  const handleKeepAliveChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeepAlive(event.target.checked);
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
        margin: 0,
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        color: "#FFF",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#FFA500",
          marginBottom: "1rem",
        }}
      >
        Välkommen tillbaka!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          maxWidth: "600px",
          marginBottom: "2rem",
          lineHeight: "1.5",
          textAlign: "center",
        }}
      >
        Logga in för att fortsätta till din dashboard och hålla koll på dina
        bikupor och nätverk.
      </Typography>

      {error && (
        <Typography
          variant="body2"
          sx={{
            color: "red",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            padding: "0.5rem",
            borderRadius: "5px",
            marginBottom: "1rem",
            textAlign: "center",
            maxWidth: "250px",
          }}
        >
          {error}
        </Typography>
      )}

      <TextField
        id="email"
        label="Email"
        variant="standard"
        sx={{
          width: "250px",
          marginBottom: "1rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "5px",
          color: "#FFF",
        }}
        InputLabelProps={{
          style: { color: "#FFF" },
        }}
        InputProps={{
          style: { color: "#FFF" },
        }}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={handleKeyPress}
      />

      <FormControl
        sx={{ width: "250px", marginBottom: "1rem" }}
        variant="standard"
      >
        <InputLabel htmlFor="password" style={{ color: "#FFF" }}>
          Password
        </InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={handleKeyPress}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                style={{ color: "#FFF" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={keepAlive}
            onChange={handleKeepAliveChange}
            sx={{
              color: "#FFA500",
              "&.Mui-checked": {
                color: "#FFA500",
              },
            }}
          />
        }
        label="Håll mig inloggad"
        sx={{ color: "#FFF", marginBottom: "1rem" }}
      />

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#FFA500",
          color: "#FFF",
          padding: "0.75rem 1.5rem",
          fontSize: "1.2rem",
          "&:hover": {
            backgroundColor: "#cc8500",
          },
        }}
        onClick={handleSignIn}
      >
        Logga in
      </Button>
    </Box>
  );
}
