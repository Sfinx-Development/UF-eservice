import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface SwishPaymentProps {
  onConfirmPayment: (e: React.FormEvent, swishPhone: string) => void;
  handleAbort: () => void;
  isOpen: boolean; // Styr om popupen ska visas eller inte
  onClose: () => void;
}

const SwishPaymentPopup: React.FC<SwishPaymentProps> = ({
  onConfirmPayment,
  isOpen,
  onClose,
  handleAbort,
}) => {
  const [swishPhone, setSwishPhone] = useState<string | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    if (swishPhone && swishPhone.trim() !== "") {
      onConfirmPayment(e, swishPhone);
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          p: 3,
          width: "90%",
          maxWidth: { xs: "400px", md: "70%" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3, // Mellanrum mellan sektionerna
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#510102" }}
          >
            Betala med Swish
          </Typography> */}
          <Box
            sx={{
              // border: "2px solid #510102",
              borderRadius: 2,
            }}
          >
            <img
              src="https://i.imgur.com/QTQYKHI.png"
              alt="Swish QR-kod"
              style={{ width: "100%", maxWidth: "280px", height: "auto" }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontSize: "0.9rem", color: "gray" }}
          >
            Skanna koden för att betala via Swish.
          </Typography>
        </Box>

        {/* Formulär Sektion */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, fontSize: "2rem" }}>
            99 kr
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontSize: "1rem" }}>
            Skanna QR-koden med Swish-appen för att betala. Fyll i det nummer du
            använder för att swisha här nedan.
          </Typography>
          <TextField
            fullWidth
            label="Telefonnummer för betalning"
            placeholder="Skriv in telefonnummer"
            value={swishPhone || ""}
            onChange={(e) => setSwishPhone(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#510102",
              color: "#fff",
              borderRadius: 2,
              padding: "0.75rem",
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#6B2020" },
            }}
          >
            Jag har swishat
          </Button>
          <Button
            variant="outlined"
            onClick={handleAbort}
            sx={{
              borderColor: "#510102",
              color: "#510102",
              marginTop: 0.5,
              borderRadius: 2,
              padding: "0.75rem",
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Avbryt
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SwishPaymentPopup;
