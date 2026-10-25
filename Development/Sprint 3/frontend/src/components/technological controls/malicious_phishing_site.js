import React, { useState, useEffect } from 'react';

const MaliciousSiteCheck = () => {
  const [testResults, setTestResults] = useState(null);  // To store test results
  const [error, setError] = useState(null);  // To store any error messages
  const [loading, setLoading] = useState(true);  // To track loading state

  useEffect(() => {
    // Fetch malicious site check results from the backend API
    setLoading(true);  // Start loading
    fetch('http://localhost:8000/tech/malicious_phishing_site')
      .then((response) => response.json())  // Parse the response as JSON
      .then((data) => {
        if (data.success) {
          setTestResults(data);  // If successful, store the data
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
    return <div>Loading Malicious Site Check...</div>;  // Display loading message while fetching data
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{`Error fetching malicious site data: ${error}`}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Malicious Site Check</h1>
      {testResults ? (
        <div>
          {Object.keys(testResults).map((testName) => (
            <div key={testName}>
              <h2>{testName}</h2>
              <p>URL: <a href={testResults[testName].url} target="_blank" rel="noopener noreferrer">{testResults[testName].url}</a></p>
              <p>{testResults[testName].message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Could not retrieve malicious site information.</p>
      )}
    </div>
  );
};

export default MaliciousSiteCheck;
