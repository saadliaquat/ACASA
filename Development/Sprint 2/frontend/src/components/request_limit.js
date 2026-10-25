import React, { useState, useEffect } from 'react';

const RequestLimitCheck = () => {
  const [requestData, setRequestData] = useState(null);  // To store data from backend
  const [error, setError] = useState(null);  // To store any error messages
  const [loading, setLoading] = useState(true);  // To track loading state

  useEffect(() => {
    // Fetch request limit status from the backend API
    setLoading(true);  // Start loading
    fetch('http://localhost:8000/request-limit')
      .then((response) => response.json())  // Parse the response as JSON
      .then((data) => {
        if (data.success) {
          setRequestData(data);  // If successful, store the data
        } else {
          setError(data.error);  // If there’s an error, store it
        }
        setLoading(false);  // Stop loading once data is fetched
      })
      .catch((err) => {
        setError(err.message);  // Catch any fetch error and set error state
        setLoading(false);
      });
  }, []);  // Effect runs only once when the component is mounted

  if (loading) {
    return <div>Loading Request Limit Status...</div>;  // Display loading message while fetching data
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{`Error fetching request limit data: ${error}`}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Request Limit Check</h1>
      {requestData ? (
        <>
          <p>Browser: {requestData.browser}</p>
          <p>Test URL: <a href={requestData.url} target="_blank" rel="noopener noreferrer">{requestData.url}</a></p>
          <p>Requests Sent: {requestData.requests_sent}</p>
          <p>{requestData.message}</p>
          {requestData.rate_limited ? (
            <span style={{ color: "red" }}>⚠️ Rate limit reached at request #{requestData.rate_limit_at}.</span>
          ) : (
            <span style={{ color: "green" }}>✅ No rate limit detected after 50 requests.</span>
          )}
        </>
      ) : (
        <p>Could not retrieve request limit information.</p>
      )}
    </div>
  );
};

export default RequestLimitCheck;
