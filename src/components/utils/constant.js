export const DUMMY_DATA = [
  {
    Name: "Robert Downey Junior",
    "Phone Number": "9876543210",
    Gender: "Male",
    Hub: "U Block",
    "Shift Timings": "12:00 AM - 03:00 PM",
  },
  {
    Name: "Scarlett Johansson",
    "Phone Number": "9123456780",
    Gender: "Female",
    Hub: "Sector 26",
    "Shift Timings": "12:00 AM - 03:00 PM",
  },
  {
    Name: "Chris Evans",
    "Phone Number": "1234567890",
    Gender: "Male",
    Hub: "U Block",
    "Shift Timings": "12:00 AM - 03:00 PM",
  },
  {
    Name: "Gal Gadot",
    "Phone Number": "5566778899",
    Gender: "Female",
    Hub: "Galleria",
    "Shift Timings": "12:00 AM - 03:00 PM",
  },
  {
    Name: "Benedict Cumberbatch",
    "Phone Number": "7788996655",
    Gender: "Male",
    Hub: "Galleria",
    "Shift Timings": "12:00 AM - 03:00 PM",
  },
];

export const formatToDateInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Returns "2025-06-18"
};