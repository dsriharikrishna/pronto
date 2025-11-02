import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import CustomerDetailsCard from "./CustomerDetailsCard";
import ServiceDetailsCard from "./ServiceDetailsCard";
import MaidDetailsCard from "./MaidDetailsCard";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchDashboardData, } from "../../redux/slicers/dashboardSlice";

import OrderOverViewCards from "./OrderOverViewCards";
import { orderDetails } from "../../redux/slicers/ordersSlice";

const OrderMainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get("id");
  const [allData, setAllData] = useState([]);
  const [bookingInfo, setBookingInfo] = useState([]);
  const [customerInfo, setCustomerInfo] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState([]);
  const [serviceInfo, setServiceInfo] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [maidName, setMaidName] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await dispatch(fetchDashboardData()).unwrap();
      const toTitleCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };
      const maidNames = response?.data?.data
         .filter(item => item.name && item.id && item.status === "active")

        .map(item => ({
          id: item.id,
          name: toTitleCase(item.name),
          status: item.status,
        }));
      
     
      setMaidName(maidNames)
      // setRefreshData((prev) => !prev);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };
  fetchData();
}, [dispatch, refreshData]);

const maidSuccess = () => {
  setRefreshData((prev) => !prev);
}

const dateChanged = () => {
  setRefreshData((prev) => !prev);
}

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await dispatch(orderDetails(id));
          const data = response?.payload?.booking;
          setAllData(data);
          setBookingInfo(data?.bookingInfo);
          setCustomerInfo(data?.customerInfo);
          setPartnerInfo(data?.partnerInfo);
          setServiceInfo(data?.serviceInfo);
        } catch (error) {
          console.error("Failed to fetch booking details:", error);
        }
      }
    };

    fetchData();
  }, [dispatch, id, refreshData]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Stack
      sx={{
        mb:2,
        // padding:'-20px !important',
        bgcolor: "#F2F2F2",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        scrollbarWidth: "thin", // For Firefox
    // "&::-webkit-scrollbar": {
    //   width: "2px", // Adjust scrollbar width
    // },
    // "&::-webkit-scrollbar-track": {
    //   background: "#f1f1f1", // Track color
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   background: "#888", // Thumb color
    //   borderRadius: "3px", // Rounded corners
    // },
    // "&::-webkit-scrollbar-thumb:hover": {
    //   background: "#555", // Hover color
    // },
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", ml: 2, my: 0.5, gap: 0.5 }}
        onClick={() => navigate(-1)}
      >
        <ArrowBack style={{ color: "gray", width: "20px" }} />
        <Typography
          sx={{
            fontSize: "14px",
            color: "gray",
            // "&:hover": { textDecoration: "underline" },
          }}
        >
          Back
        </Typography>
      </Box>
      <Stack gap={1} mx={2}>
        <OrderOverViewCards
          bookingInfo={bookingInfo || []}
          serviceInfo={serviceInfo || []}
          maidName={maidName || []}
          maidSuccess={maidSuccess}
          dateChanged={dateChanged}
        />

        <CustomerDetailsCard customerInfo={customerInfo || []} />
        <Stack
          direction="row"
          gap={1}
          height="100%"
          sx={{
            "& > *": {
              flex: 1,
              minWidth: 0,
            },
          }}
          mb={3}
        >
          <Stack flex={1} height={"100%"}>
            <ServiceDetailsCard
              serviceInfo={serviceInfo}
              bookingInfo={bookingInfo}
            />
          </Stack>
          <Stack flex={1} height={"100%"}>
            <MaidDetailsCard
              partnerInfo={partnerInfo || []}
              serviceInfo={serviceInfo || []}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderMainPage;
