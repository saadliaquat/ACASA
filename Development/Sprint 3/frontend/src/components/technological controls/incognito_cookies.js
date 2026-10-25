import React, { useState, useEffect } from "react";

const IncognitoCookiesCheck = () => {
  const [incognitoData, setIncognitoData] = useState(null); // To store the data from the backend
  const [error, setError] = useState(null); // To store any errors
  const [loading, setLoading] = useState(true); // Loading state to show the progress

  useEffect(() => {
    // Fetch the incognito cookies status from the backend API
    setLoading(true); // Start loading
    fetch("http://localhost:8000/tech/incognito_cookies")
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        if (data.success) {
          setIncognitoData(data); // If successful, store the data
        } else {
          setError(data.error); // If there is an error, store the error
        }
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError(err.message); // Catch and set any fetch error
        setLoading(false);
      });
  }, []); // Run the effect only once when the component mounts

  if (loading) {
    return <div>Loading Incognito Cookies Status...</div>; // Show loading text while fetching data
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching incognito cookies status: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Incognito Mode Cookies Check</h1>
      {incognitoData ? (
        <>
          <p>Test URL: <a href={incognitoData.url} target="_blank" rel="noopener noreferrer">{incognitoData.url}</a></p>
          <p>{incognitoData.message}</p>
          {incognitoData.cookies_cleared ? (
            <span style={{ color: "green" }}>✅ Cookies are cleared correctly (Incognito mode works).</span>
          ) : (
            <span style={{ color: "red" }}>❌ Cookies are not cleared</span>
          )}
        </>
      ) : (
        <p>Could not retrieve incognito cookies information.</p>
      )}
    </div>
  );
};

export default IncognitoCookiesCheck;
