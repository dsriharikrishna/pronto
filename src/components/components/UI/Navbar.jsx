import React, { useEffect, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { SignOut } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import LogOutModel from "../Models/LogOutModel";

const Navbar = ({ title, open }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProfilePic(localStorage.getItem("profilePic"));
  }, []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => setLogoutDialogOpen(true);
  const handleLogoutCancel = () => setLogoutDialogOpen(false);

  return (
    <Box>
      <AppBar
        sx={{
          top: 0,
          width: `calc(100% - ${open ? "0px" : "0px"})`,
          transition: "width 0.3s ease, padding-left 0.3s ease",
          backgroundColor: "white",
          boxShadow: "none",
          borderBottom: "1px solid #D1D5DB",
          paddingLeft: open ? "220px" : "60px",
          transform: "translate3d(0,0,0)",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Title Section */}
            <Box
              sx={{
                transition: "min-width 0.3s ease",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  lineHeight: "30px",
                  color: "#111928",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </Typography>
            </Box>

            {/* Avatar Section */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexGrow: 1,
                gap: 1,
              }}
            >
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    transition: "box-shadow 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 0 0 2px rgba(0,182,100,0.5)",
                    },
                  }}
                  src={profilePic}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                arrow
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    boxShadow: "none",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    minWidth: 160,
                    mt: 1.5,
                    p: 0.5,
                  },
                }}
                MenuListProps={{
                  sx: { p: 0 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                    handleLogout();
                  }}
                  sx={{
                    fontSize: "14px",
                    lineHeight: "21px",
                    color: "#111928",
                    display: "flex",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <SignOut size={18} style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <LogOutModel open={logoutDialogOpen} onClose={handleLogoutCancel} />
    </Box>
  );
};

export default Navbar;