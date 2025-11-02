import { ReScheduleDate } from "../redux/slicers/ordersSlice";
import { BASE_URL } from "../utils/common";

export const ApiConfigures = {
  BASE_URL,
  ENDPOINTS: {
    ADMIN_LOGIN: "/auth/admin-login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    PRONTO_MATCH: "/matchmaking/manual",
    PRONTO_USERS: "/users/partners",
    CREATE_PARTNER: "/users/create_user",
    PARTNERS_ALL: "/users/partners",
    EDIT_PARTNER: "/users/editUser",
    DELETE_PARTNER: "/partner/delete_partners",
    PARTNER_STATUS_SAVE: "/partner/update-partner-status",
    PRONTO_TABLE: "/bookings/recentOrders",
    PRONTO_CHART: "/bookings/getDetailCounts",
    USERS_ALL: "/users/users",
    MAIDMATCH: "/partner/assign-partner",
    ORDERS_BY_DATE_OLD: "/bookings/orders-by-date",
    ORDERS_BY_DATE: "/bookings/admin/get-bookings",
    SECTORS: "/catalog ",
    SECTORSAVE: "/bookings/update-booking-status",
    CREATE_SECTOR: "/sector/add",
    SAVE_CATALOG_DATA: "/sector/save-catalog-data",
    GET_CATALOG_DATA: "/sector/get-catalog-data",
    GET_SECTOR_LIST: "/sector/get-sector-list",
    // ADMIN_LOGIN: "/auth/admin-login",
    RESCHEDULEDATE: "/bookings/admin/reschedule-booking",
    UPDATEDPARENTBOOKINGPARTNER: "/bookings/admin/update-preferred-partner",
    ASSIGN_HUB_STATUS_PARTNER: "/bookings/admin/assign-to-booking",
    HUBS: "/hub/allHubs",
    HUB: "/hub",
    SAVE_HUB_SELECTION: "/partner/assign-hub",
    PRATNERMOBILEVERIFY: "/users/verifyMobileNumber",
    CREATEHUB: "/hub/createNewHub",
    CHILD_ORDERS: "/bookings/parentId",
    ORDERUPDATE: "/bookings/recurring/update-recurring-childs",
    UPDATE_BOOKING_SCHEDULE: "/bookings/schedule/update-booking-schedule",
    GOOGLE_LOGIN: "/auth/google-login",
    PARTNER_SHIFTS: "/partner-shifts",
    PARTNER_SHIFT_BY_ID: "/partner-shifts",
    PARTNER_SHIFT_AUDIT_LOG: "/partner-shifts",
    RECURRINGDISCOUNTPAGE: "/sector/config/get-recurring-mapper",
    UPDATERECURRINGDISCOUNTPAGE: '/sector/config/update-recurring-mapper'
  },
};

export default ApiConfigures;

