import React, { useState, useEffect } from "react";

const SafeBrowsingCheck = () => {
  const [safeBrowsingData, setSafeBrowsingData] = useState(null); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Fetch safe browsing status from the backend
    fetch("http://localhost:8000/tech/safe_browsing")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSafeBrowsingData(data);
        } else {
          setError(data.error);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading Safe Browsing status...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching Safe Browsing data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Safe Browsing Check</h1>
      {safeBrowsingData ? (
        <>
          <p>{safeBrowsingData.message}</p>
          {safeBrowsingData.safe_browsing_status ? (
            <span style={{ color: "green" }}>✅ Safe Browsing is Enabled</span>
          ) : (
            <span style={{ color: "red" }}>❌ Safe Browsing is Disabled</span>
          )}
        </>
      ) : (
        <p>Could not retrieve Safe Browsing information.</p>
      )}
    </div>
  );
};

export default SafeBrowsingCheck;
