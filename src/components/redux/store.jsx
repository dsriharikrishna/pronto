import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slicers/dashboardSlice";
import authReducer from "./slicers/authSlice";
import partnerReducer from "./slicers/partnerSlice";
import ordersReducer from "./slicers/ordersSlice";
import shiftReducer from './slicers/shiftSlice';
import RecurringDiscountReducer from './slicers/RecurringDiscountSlice';


export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    auth: authReducer,
    partners: partnerReducer,
    orders: ordersReducer,
    shifts: shiftReducer,
    recurringDiscount: RecurringDiscountReducer,
  },
});
