import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EditableNumberObjectForm from "../../components/data/EditableNumberObjectForm";
import {
  fetchRecurringDiscountPage,
  updateRecurringDiscountPage,
} from "../../redux/slicers/RecurringDiscountSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecurringDiscountPage = () => {
  const [recordId, setRecordId] = useState(null);
  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({});
  const [multiPlier, setMultiPlier] = useState(0);

  const { loading } = useSelector((state) => state.recurringDiscount);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(fetchRecurringDiscountPage()).unwrap();
      if (response && response.length && response[0].data) {
        const record = response[0];
        setMultiPlier(record.multiplier);
        setRecordId(record.id);
        setInitialData(record.data);
        setFormData(record.data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
      toast.error("Failed to load data.");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (key, value) => {
    const num = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [key]: isNaN(num) ? "" : num,
    }));
  };

  const isValidData = Object.values(formData).every(
    (val) => typeof val === "number" && val >= 0 && val <= 1
  );

  const handleSubmit = async () => {
    if (!isValidData || !recordId) {
      toast.warn("values should be between 0 and 1");
      return;
    }

    if (!multiPlier) {
      toast.warn("multiplier is required");
      return;
    }

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, val]) => [key, parseFloat(val)])
    );

    const payload = {
      id: recordId,
      multiplier: parseFloat(multiPlier),
      data: cleanedData,
    };

    try {
      const response = await dispatch(
        updateRecurringDiscountPage(payload)
      ).unwrap();
      // console.log("✅ Updated successfully:", response);
      setInitialData(cleanedData);
      toast.success(response?.message || "Data updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update:", error);
      toast.error("Failed to update data.");
    }
  };

  return (
    <Box sx={{ px: 0, py: 2, mx: "auto", overflow: "auto" }}>
      {loading || !formData || Object.keys(formData).length === 0 ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <EditableNumberObjectForm
          formData={formData}
          multiPlier={multiPlier}
          setMultiPlier={setMultiPlier}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        pauseOnHover
        draggable
        theme="colored"
      />
    </Box>
  );
};

export default RecurringDiscountPage;
