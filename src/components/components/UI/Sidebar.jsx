import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  Stack,
  Toolbar,
  IconButton,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Package,
  User,
  CaretRight,
  CaretLeft,
  Book,
  Calendar,
} from "phosphor-react";
import { LogoutRounded } from "@mui/icons-material";
import LogOutModel from "../Models/LogOutModel";
import Logo from "../../../assets/ProntoLogo.png";
import DiscountIcon from '@mui/icons-material/Discount';
 
import { getUserRole } from "../../utils/authUtils";
 
const drawerWidth = 220;
const collapsedWidth = 60;
 
const StableDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
 
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
 
const Sidebar = ({ open, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogOut, setIsLogOut] = useState(false);
 
  const role = getUserRole();
 
  const menuItems = [
    {
      text: "Bookings",
      icon: <Package size={22} />,
      path: "/bookings",
      matchPaths: ["/bookings", "/bookings/upcoming", "/bookings/historical"],
    },
    {
      text: "Customers",
      icon: <Users size={22} />,
      path: "/Customer",
      matchPaths: ["/Customer"],
    },
    {
      text: "Workers",
      icon: <User size={20} />,
      path: "/Workers",
      matchPaths: ["/Workers", "/workers/add"],
    },
    {
      text: "Shift Management",
      icon: <Calendar size={22} />,
      path: "/ShiftManagement",
      matchPaths: ["/ShiftManagement"],
    },
    ...(role === "SUPER_ADMIN"
      ? [
          {
            text: "Sectors",
            icon: <Book size={22} />,
            path: "/Sectors",
            matchPaths: ["/Sectors"],
          },
        ]
      : []),
    // {
    //   text: "Orders",
    //   icon: <Package size={22} />,
    //   path: "/Orders",
    //   matchPaths: [
    //     "/Orders",
    //     "/OrderDetails",
    //     "/orders/today",
    //     "/orders/tomorrow",
    //     "/orders/all",
    //     "/orders/instant",
    //     "/orders/scheduled",
    //     "/orders/recurring",
    //   ],
    // },
    ...(role === "SUPER_ADMIN"
      ? [
          {
            text: "Recurring Discount",
            icon: <DiscountIcon sx={{ fontSize: 22 }} />,
            path: "/RecurringDiscountPage",
            matchPaths: ["/RecurringDiscountPage"],
          },
        ]
      : []),
  ];
 
  const isActive = (item) => {
    return item.matchPaths.some((path) => location.pathname.startsWith(path));
  };
 
  const firstName = localStorage.getItem("firstName") || "";
  const InitialName = firstName?.charAt(0).toUpperCase() || "";
 
  const handleLogout = () => setIsLogOut(true);
  const handleClose = () => setIsLogOut(false);
 
  return (
    <StableDrawer
      variant="permanent"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          padding: "0px",
          // position: "relative",
          height: "100vh",
        },
      }}
    >
      <Stack
        height="100%"
        justifyContent="space-between"
        sx={{
          overflow: "hidden",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <div>
          {!open ? (
            <Toolbar>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  mt: 2.5,
                  ml: -4,
                  p: 1.5,
                  borderRadius: 50,
                  boxShadow: "1px 2px 2px lightgray",
                  aspectRatio: 1,
                  bgcolor: "white",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CaretRight size={20} color="#00b664" />
              </IconButton>
            </Toolbar>
          ) : (
            <Stack
              position="relative"
              direction="row"
              alignItems="center"
              height="64px"
              justifyContent="space-between"
              width="100%"
              borderBottom="1px solid lightgray"
            >
              <Stack ml={2}>
                <img src={Logo} alt="ProntoLogo" width={100} height="auto" />
              </Stack>
 
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: -0.5,
                  zIndex: 10,
                  backgroundColor: "#f5f7fc",
                  boxShadow: "0px 2px 2px lightgray",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  p: 1.5,
                  "&:hover": {
                    backgroundColor: "#f0f2f5",
                  },
                }}
              >
                <CaretLeft size={20} color="#00b664" />
              </IconButton>
            </Stack>
          )}
 
          <List disablePadding sx={{ mx: 1, mt: open ? 4 : 2 }}>
            {menuItems.map((item) => (
              <Tooltip
                key={item.path}
                title={!open ? item.text : ""}
                placement="right"
                arrow
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={isActive(item)}
                    onClick={() => navigate(item.path)}
                    sx={{
                      mt: 1,
                      justifyContent: open ? "initial" : "center",
                      borderRadius: "8px",
                      transition:
                        "background-color 0.2s ease, transform 0.2s ease",
                      "&.Mui-selected": {
                        backgroundColor: "#00b664",
                        color: "white",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#00b664",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(0, 182, 100, 0.1)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                      sx={{
                        opacity: open ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </div>
 
        <div>
          <Tooltip title={!open ? "Logout" : ""} placement="right" arrow>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  justifyContent: open ? "initial" : "center",
                  borderRadius: "8px",
                  mt: 1,
                  mx: 1,
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(224, 36, 36, 0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutRounded />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                  primary="Logout"
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </div>
      </Stack>
      <LogOutModel open={isLogOut} onClose={handleClose} />
    </StableDrawer>
  );
};
 
export default Sidebar;
 
 