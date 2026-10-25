import React, { useState, useEffect } from "react";

const UserAccountManagement = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user account data from the backend
    fetch("http://localhost:8000/user-account-mgmt")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Make sure the response contains the expected keys
          setUserData(data.result || {});
        } else {
          setError(data.error || "Unknown error");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading user account data...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>Error fetching user account data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>User Account Management</h1>
      {userData ? (
        <>
          <p>Unauthorized users found: {userData["unauthorized_users"].length > 0 ? "yes" : "no"}</p>
          {userData["unauthorized_users"] && userData["unauthorized_users"].length > 0 ? (
            <ul>
              {userData["unauthorized_users"].map((user, index) => (
                <li key={index}>{user}</li>
              ))}
            </ul>
          ) : (
            <p>No unauthorized Users detected</p>
          )}
        </>
      ) : (
        <p>Could not retrieve user account information.</p>
      )}
    </div>
  );
};

export default UserAccountManagement;
