import React, { useState, useEffect } from "react";

const AdBlockCheck = () => {
  const [adBlockData, setAdBlockData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch adblock status from the backend
    setLoading(true); // Set loading state to true before fetching data
    fetch("http://localhost:8000/tech/adblock_status")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAdBlockData(data);
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Only run on initial render

  if (loading) {
    return <div>Loading Adblock status...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching Adblock data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Adblock Status Check</h1>

      {adBlockData ? (
        <>
          <p>
            Test URL: <a href={adBlockData.url} target="_blank" rel="noopener noreferrer">{adBlockData.url}</a>
          </p>
          <p>{adBlockData.message}</p>
          {adBlockData.ads_blocked ? (
            <span style={{ color: "green" }}>✅ Ads are blocked (Adblocker enabled)</span>
          ) : (
            <span style={{ color: "red" }}>❌ Ads are visible (No adblock detected)</span>
          )}
        </>
      ) : (
        <p>Could not retrieve Adblock information.</p>
      )}
    </div>
  );
};

export default AdBlockCheck;
