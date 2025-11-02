import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

// ✅ Lazy-loaded Components
const Sidebar = lazy(() => import("../components/UI/Sidebar"));
const Navbar = lazy(() => import("../components/UI/Navbar"));
const Login = lazy(() => import("../auth/Login"));
const DataTable = lazy(() => import("../components/UI/DataTable"));
const Customer = lazy(() => import("../pages/Dashboard/Customer"));
const Orders = lazy(() => import("../pages/Dashboard/Orders"));
const OrdersPage = lazy(() => import("../pages/newOrdersSection/OrdersPage"));
const Hubs = lazy(() => import("../pages/Dashboard/Hubs"));
const ServicePartner = lazy(() => import("../pages/Dashboard/ServicePartner"));
const Sectors = lazy(() => import("../pages/Dashboard/Sectors"));
const ShiftManagement = lazy(() =>
  import("../components/partners/ShiftManagement")
);
const RecurringDiscountPage = lazy(() =>
  import("../pages/Dashboard/RecurringDiscountPage")
);
const AddServicePartner = lazy(() =>
  import("../components/partners/AddServicePartner")
);
const EditPartner = lazy(() => import("../components/partners/EditPartner"));
const OrderMainPage = lazy(() => import("../pages/orderDetails/OrderMainPage"));
const PageNotFound = lazy(() => import("../components/UI/PageNotFound"));

const protectedRoutes = [
  "/DataTable",
  "/Customer",
  "/Orders",
  "/Hubs",
  "/Workers",
  "/Sectors",
  "/orders/:tab",
  "/bookings",
  "/bookings/:tab",
  "/OrderDetails",
  "/workers/add",
  "/ShiftManagement",
  "/RecurringDiscountPage",
];

const publicRoutes = ["/", "/SignIn"];

const AllRoutes = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isProtectedRoute = protectedRoutes.some((route) =>
    matchPath({ path: route, end: false }, location.pathname)
  );

  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [location.pathname]);

  const routeTitle = useMemo(() => {
    const path = location.pathname.toLowerCase();

    if (path.includes("customer")) return "Customers";
    if (path.includes("orders") || path.includes("bookings")) return "Orders";
    if (path.includes("workers") || path.includes("workers"))
      return "Workers";
    if (path.includes("hubs")) return "Hubs";
    if (path.includes("sectors")) return "Sectors";
    if (path.includes("datatable")) return "Data Table";
    if (path.includes("shiftmanagement")) return "Shift Management";
    if (path.includes("recurringdiscountpage"))
      return "Recurring Discount";

    return "";
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: {
          xs: "auto",
          md: "hidden",
        },
        transition: "padding-left 0.3s ease-in-out",
      }}
    >
      <Suspense
        fallback={
          <Box p={2}>
            {/* <CircularProgress size={40} /> */}
          </Box>
        }
      >
        {isProtectedRoute && (
          <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar} />
        )}
      </Suspense>

      <Suspense
        fallback={
          <Box p={2}>
            {/* <CircularProgress size={40} /> */}
          </Box>
        }
      >
        {isProtectedRoute && (
          <Navbar
            open={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title={routeTitle}
          />
        )}
      </Suspense>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isProtectedRoute
            ? `calc(100% - ${isSidebarOpen ? "220px" : "60px"})`
            : "100%",
          transition: "width 0.3s ease-in-out, margin 0.3s ease-in-out",
          overflowY: "auto",
          height: "100vh",
          mt: isProtectedRoute ? "64px" : 0,
          px: 3,
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          }
        >
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/DataTable" element={<DataTable />} />
              <Route path="/Customer" element={<Customer />} />
              <Route path="/bookings" element={<OrdersPage />} />
              <Route path="/bookings/:tab" element={<OrdersPage />} />
              <Route path="/OrderDetails" element={<OrderMainPage />} />
              <Route path="/Hubs" element={<Hubs />} />
              <Route path="/Workers" element={<ServicePartner />} />
              <Route path="/ShiftManagement" element={<ShiftManagement />} />
              <Route
                path="/workers/add"
                element={<AddServicePartner />}
              />
              <Route path="/workers/edit" element={<EditPartner />} />
              <Route
                path="/Sectors"
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <Sectors />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/RecurringDiscountPage"
                element={
                  <RoleProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                    <RecurringDiscountPage />
                  </RoleProtectedRoute>
                }
              />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

export default AllRoutes;
