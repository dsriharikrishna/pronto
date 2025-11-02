let BASE_URL;

const hostname = window.location.hostname;

if (hostname === "devadmin.withpronto.com") {
  BASE_URL = "https://devadminapi.withpronto.com";
} else if (hostname === "admin.withpronto.com") {
  BASE_URL = "https://adminapi.withpronto.com";
} else if (hostname === "stgadmin.withpronto.com") {
  // BASE_URL = "https://stgapi.withpronto.com"
  BASE_URL = "https://stgadminapi.withpronto.com";
} else if (hostname === "localhost") {
 BASE_URL = "https://devadminapi.withpronto.com";
  // BASE_URL = "https://stgadminapi.withpronto.com";
    // BASE_URL = "http://localhost:3000";
} else {
  BASE_URL = "https://api.withpronto.com";
}

export { BASE_URL };
