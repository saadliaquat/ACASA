import React, { useState, useEffect } from 'react';

const ThirdPartyCookiesCheck = () => {
  const [cookieStatus, setCookieStatus] = useState(null);  // To store the third-party cookie check result
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To store any error message

  useEffect(() => {
    // Fetch third-party cookie check result from backend API
    setLoading(true);  // Set loading to true before fetching data
    fetch('http://localhost:8000/tech/third_party_cookies')
      .then((response) => response.json())  // Parse response as JSON
      .then((data) => {
        if (data.success) {
          setCookieStatus(data);  // If success, store data in state
        } else {
          setError(data.error);  // If there's an error, store error message
        }
        setLoading(false);  // Stop loading once data is fetched
      })
      .catch((err) => {
        setError(err.message);  // Catch any fetch error and store the message
        setLoading(false);  // Stop loading even in case of error
      });
  }, []);  // Effect runs once when the component is mounted

  if (loading) {
    return <div>Loading Third-party Cookies Check...</div>;  // Show loading message while fetching data
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{`Error fetching cookie check data: ${error}`}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Third-party Cookies Check</h1>
      {cookieStatus ? (
        <div>
          <p>{cookieStatus.message}</p>
          <p>Third-party Cookies Blocked: {cookieStatus.third_party_cookies_status ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p>Could not retrieve third-party cookie information.</p>
      )}
    </div>
  );
};

export default ThirdPartyCookiesCheck;
