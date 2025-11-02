import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Tabs, Tab, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OrdersEditModel from "../../components/Models/OrdersEditModel";
import CustomTable from "./CustomTabel";
import Legends from "../../utils/Legends";

// Constants
const TABS = ["Today", "Tomorrow", "All", "Instant", "Scheduled", "Recurring"];

const Orders = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { tab } = useParams();

  const normalizedTabs = useMemo(() => TABS.map((t) => t.toLowerCase()), []);

  // Determine active tab index from URL param
  const activeTabFromUrl = normalizedTabs.indexOf((tab || "").toLowerCase());
  const [activeTab, setActiveTab] = useState(
    activeTabFromUrl >= 0 ? activeTabFromUrl : 0
  );

  useEffect(() => {
    if (activeTabFromUrl >= 0 && activeTabFromUrl !== activeTab) {
      setActiveTab(activeTabFromUrl);
    }
  }, [tab]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenDetails = useCallback((id) => {
    setIsOpen(true);
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // const isBookingTypeTab = useMemo(() => TABS.includes(TABS[activeTab]), [activeTab]);
  const isBookingTypeTab = TABS.includes(TABS[activeTab]);

  const renderTab = useCallback(
    (tab, index) => (
      <Tab
        key={index}
        label={tab}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          pl: isMobile ? 1 : 2,
          pr: isMobile ? 1 : 2,
          textTransform: "capitalize",
          color: activeTab === index ? "#00b664" : "black",
          fontWeight: activeTab === index ? "bold" : "normal",
          borderBottom: activeTab === index ? "2px solid #00b664" : "none",
          "&.Mui-selected": {
            color: "#00b664",
          },
        }}
      />
    ),
    [activeTab]
  );

  const handleTabChange = useCallback(
    (_, newVal) => {
      const path = `/orders/${normalizedTabs[newVal]}`;
      navigate(path);
    },
    [navigate, normalizedTabs]
  );

  return (
    <Box height="100vh" >
      <Stack
        sx={{
          flexDirection: { xs: "column", md: "row" },
          alignItems: "",
          justifyContent: "space-between",
          padding: 0,
          m: 0,
          gap: {xs:1, md: 0},
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ p: 0, m: 0, minHeight: 0 }}
          TabIndicatorProps={{
            style: { backgroundColor: "#00b664" },
          }}
        >
          {TABS.map(renderTab)}
        </Tabs>
        {/* <Legends /> */}
      </Stack>

      <OrdersEditModel
        isOpen={isOpen}
        handleClose={handleClose}
        selectedId={selectedId}
      />

      {isBookingTypeTab && (
        <CustomTable bookingType={TABS[activeTab]} activeTab={activeTab} />
      )}
    </Box>
  );
};

export default Orders;

//Before adding routing
// import React, { useState, useCallback, useMemo } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Stack,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import OrdersEditModel from "../../components/Models/OrdersEditModel";
// import CustomTable from "./CustomTabel";
// import Legends from "../../utils/Legends";

// // Constants
// const TABS = ["Today", "Tomorrow", "All", "Instant", "Scheduled", "Recurring"];

// const Orders = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const [activeTab, setActiveTab] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleOpenDetails = useCallback((id) => {
//     setIsOpen(true);
//     setSelectedId(id);
//   }, []);

//   const handleClose = useCallback(() => {
//     setIsOpen(false);
//   }, []);

//   const handleSearchChange = useCallback((e) => {
//     setSearchQuery(e.target.value);
//   }, []);

//   const isBookingTypeTab = useMemo(() => TABS.includes(TABS[activeTab]), [activeTab]);

//   const renderTab = useCallback(
//     (tab, index) => (
//       <Tab
//         key={index}
//         label={tab}
//         sx={{
//           textTransform: "capitalize",
//           color: activeTab === index ? "#00b664" : "black",
//           fontWeight: activeTab === index ? "bold" : "normal",
//           borderBottom: activeTab === index ? "2px solid #00b664" : "none",
//           "&.Mui-selected": {
//             color: "#00b664",
//           },
//         }}
//       />
//     ),
//     [activeTab]
//   );

//   return (
//     <Box height="100vh">
//       <Stack sx={{flexDirection:{xs :'column' ,md:'row'}}} alignItems="center" justifyContent="space-between" >
//         <Tabs
//           value={activeTab}
//           onChange={(_, newVal) => setActiveTab(newVal)}
//           variant="scrollable"
//           scrollButtons="auto"
//           TabIndicatorProps={{
//             style: { backgroundColor: "#00b664" },
//           }}
//         >
//           {TABS.map(renderTab)}
//         </Tabs>
//         <Legends />
//       </Stack>

//       <OrdersEditModel
//         isOpen={isOpen}
//         handleClose={handleClose}
//         selectedId={selectedId}
//       />

//       {isBookingTypeTab && (
//         <CustomTable bookingType={TABS[activeTab]} activeTab={activeTab} />
//       )}
//     </Box>
//   );
// };

// export default React.memo(Orders);
