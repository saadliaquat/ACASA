import React, { useState, useEffect } from "react";

const FirewallStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch firewall status from the backend
    fetch("http://localhost:8000/tech/firewall_status")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStatusData(data);
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
    return <div>Loading firewall status...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching firewall status: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Firewall Status</h1>
      {statusData ? (
        <>
          <p>
            Firewall is{" "}
            {statusData.firewall_enabled ? "enabled" : "disabled"}.
          </p>
          {statusData.status_code !== undefined && (
            <p>Status Code: {statusData.status_code}</p>
          )}
          {statusData.output && (
            <>
              <h3>Additional Information:</h3>
              <pre>
                <code>{statusData.output}</code>
              </pre>
            </>
          )}
        </>
      ) : (
        <p>Could not retrieve firewall status.</p>
      )}
    </div>
  );
};

export default FirewallStatus;
