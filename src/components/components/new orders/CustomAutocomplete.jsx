import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";

const CustomAutocomplete = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select Worker",
  showRemoveButton = false,
  onRemove,
  isLoading = false,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef();

  useEffect(() => {
    setFilteredOptions(
      options.filter((opt) =>
        opt.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    // Don't update UI immediately - let parent handle async operation
    onChange(option);
    setShowOptions(false);
  };

  useEffect(() => {
    if (value) {
      const matched = options.find((opt) => opt.id === value);
      if (matched) setInputValue(matched.name);
    } else {
      setInputValue("");
    }
  }, [value, options]);

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
    setShowOptions(false);
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        size="small"
        value={inputValue}
        disabled={disabled || isLoading}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && (
                <CircularProgress size={16} sx={{ mr: 1 }} />
              )}
              {showRemoveButton && value && (
                <IconButton
                  size="small"
                  onClick={handleRemove}
                  disabled={isLoading}
                  sx={{ 
                    padding: "4px",
                    marginLeft: "4px",
                    color: "#ff1744",
                    backgroundColor: "rgba(255, 23, 68, 0.08)",
                    border: "1px solid rgba(255, 23, 68, 0.2)",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 23, 68, 0.15)",
                      borderColor: "rgba(255, 23, 68, 0.4)"
                    },
                    "&:disabled": {
                      color: "#ccc",
                      backgroundColor: "rgba(0, 0, 0, 0.05)"
                    }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        inputProps={{
          style: {
            color: "#333", 
            fontSize: "13px",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            backgroundColor: "#fff",
          },
        }}
      />
      {showOptions && !disabled && !isLoading && (
        <Paper
          sx={{
            position: "absolute",
            zIndex: 999,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
            mt: "2px",
            borderRadius: "0 0 4px 4px",
            boxShadow: 3,
            p: 0,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Box
                key={option.id}
                onClick={() => handleSelect(option)}
                sx={{
                  p: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                {option.name}
              </Box>
            ))
          ) : (
            <Box sx={{ p: "8px", color: "#999" }}>No Results Found</Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default CustomAutocomplete;
