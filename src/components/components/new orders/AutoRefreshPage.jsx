import React, { useState, useEffect } from "react";

const AutoRefreshPage = ({ fetchDataWithTimer }) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    let intervalId;
    let countdownId;

    if (autoRefresh) {
      setSecondsLeft(60);

      countdownId = setInterval(() => {
        setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 60));
      }, 1000);

      intervalId = setInterval(() => {
        if (typeof fetchDataWithTimer === "function") {
          fetchDataWithTimer();
        }
      }, 60000);
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [autoRefresh, fetchDataWithTimer]);

  return (
    <div style={{ padding: "12px 16px", fontFamily: "Inter, Arial, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => {
              setAutoRefresh(e.target.checked);
              setSecondsLeft(60);
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            Enable Auto-Refresh (every 1 minute)
          </span>
        </label>

        {autoRefresh && (
          <span style={{ fontSize: "13px", color: "#555" ,marginLeft:"4px"}}>
            Refreshing in <strong>{secondsLeft}</strong> second{secondsLeft !== 1 ? "s" : ""}.
          </span>
        )}
      </div>
    </div>
  );
};

export default AutoRefreshPage;
