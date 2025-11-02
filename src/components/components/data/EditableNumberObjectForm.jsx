import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
  Divider,
} from "@mui/material";

const EditableNumberObjectForm = ({
  formData,
  multiPlier,
  setMultiPlier,
  handleChange,
  handleSubmit,
}) => {
  const entries = Object.entries(formData);
  const weeks = Math.ceil(entries.length / 7);

  // Validation logic
  const isMultiplierInvalid =
    multiPlier === "" || isNaN(Number(multiPlier)) || Number(multiPlier) < 0 || Number(multiPlier) > 1;

  const fieldErrors = Object.fromEntries(
    entries.map(([key, value]) => [
      key,
      value === "" || isNaN(Number(value)) || Number(value) < 0 || Number(value) > 1,
    ])
  );

  const hasFieldErrors = isMultiplierInvalid || Object.values(fieldErrors).some(Boolean);

  return (
    <Box sx={{ px: 0, py: 0 }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            pb: 2,
            display: "flex",
            width: "100%",
            gap: 2,
            justifyContent: "flex-start",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            multiplier
          </Typography>
          <TextField
            size="small"
            fullWidth
            type="number"
            value={multiPlier}
            onChange={(e) => setMultiPlier(e.target.value)}
            inputProps={{ min: 0, max: 1, step: 0.01 }}
            sx={{
              width: "300px",
              height: "32px",
            }}
            label="Multiplier"
            variant="outlined"
            required
            error={isMultiplierInvalid}
            helperText={
              isMultiplierInvalid ? "Value must be between 0 and 1" : ""
            }
          />
        </Box>

        <Box
          mt={3}
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleSubmit}
            sx={{ bgcolor: "#00b664", color: "white", px: 4 }}
            disabled={hasFieldErrors}
          >
            Update
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          Discount Occurrences
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[...Array(weeks)].map((_, weekIndex) => (
            <Box key={weekIndex}>
              {/* Week Label on top */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ pl: 0.5, fontSize: 12, fontWeight: 600 }}
                >
                  Week {weekIndex + 1}
                </Typography>
                <Divider sx={{ mb: 0.5 }} />
              </Box>

              {/* Week Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 2,
                }}
              >
                {entries
                  .slice(weekIndex * 7, weekIndex * 7 + 7)
                  .map(([key, value], index) => (
                    <Box key={key}>
                      <InputLabel sx={{ fontSize: 12, mb: 0.5 }}>
                        Day {weekIndex * 7 + index + 1}
                      </InputLabel>
                      <TextField
                        type="number"
                        size="small"
                        fullWidth
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                        error={fieldErrors[key]}
                        helperText={
                          fieldErrors[key]
                            ? "Value must be between 0 and 1"
                            : ""
                        }
                      />
                    </Box>
                  ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EditableNumberObjectForm;
