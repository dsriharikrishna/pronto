const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${day}-${month}-${year}, ${String(hour12).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;
};

const formatTimeString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const localDateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  return localDateTimeString;
};

function getDayName(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    console.error("Invalid date:", dateString);
    return "";
  }

  // Get day name (e.g., Monday, Tuesday)
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 === 0 ? 12 : h % 12;
  return `${formattedHour}:${minute} ${suffix}`;
};

const convertUTCToIST = (datetimeUTC) => {
  const utcDate = new Date(datetimeUTC);
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(utcDate.getTime() + istOffsetMs);
  return new Date(istDate).toISOString();
};

const getMaxTimeIST = (datetimeUTC) => {
  const utcDate = new Date(datetimeUTC);
  const istOffsetMs = 5.5 * 60 * 60 * 1000;

  // Convert UTC to IST
  const istDate = new Date(utcDate.getTime() + istOffsetMs);

  // Get IST date parts
  const year = istDate.getFullYear();
  const month = istDate.getMonth();
  const day = istDate.getDate();

  // Create max IST time (23:59:59.999 IST)
  const maxISTDate = new Date(year, month, day, 23, 59, 59, 999);

  // Convert back to UTC
  const maxISTinUTC = new Date(maxISTDate.getTime() - istOffsetMs);

  return maxISTinUTC.toISOString();
};


export {
  formatDateTime,
  formatTimeString,
  getDayName,
  formatTime,
  convertUTCToIST,
  getMaxTimeIST,
  
};
