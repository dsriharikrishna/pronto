const TABS = [
  { key: "UPCOMING", Label: "Upcoming" },
  { key: "HISTORICAL", Label: "Historical" },
  { key: "MISSED_ASSIGNMENTS", Label: "Alerts on Missed Assignments" },
];

const statusOptionsRecurring = [
  { key: "PENDING_MATCH", label: "Pending Match" },
  { key: "CANCELLED", label: "Cancelled" },
];

const statusOptions = [
  { key: "PENDING_MATCH", label: "Pending Match" },
  { key: "MATCHED", label: "Matched" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "COMPLETED", label: "Completed" },
  { key: "STARTED", label: "Started" },
  { key: "PAUSED", label: "Paused" },
];

const statusTypeOptions = [
  { label: "All", value: "ALL" },
  { label: "Pending Match", value: "PENDING_MATCH" },
  { label: "Matched", value: "MATCHED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Started", value: "STARTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const recurringTypeOptions = [
  { label: "All", value: "ALL" },
  { label: "Daily", value: "DAILY" },
  { label: "Weekly", value: "WEEKLY" },
  { label: "Custom", value: "CUSTOM" },
];

const bookingTypes = [
  { label: "All", value: "ALL" },
  { label: "Instant", value: "INSTANT" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Recurring", value: "RECURRING" },
];

export {
  TABS,
  statusOptionsRecurring,
  statusOptions,
  statusTypeOptions,
  recurringTypeOptions,
  bookingTypes,
};
