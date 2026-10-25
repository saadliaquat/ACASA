import React, { useState } from 'react';
import '../Design/register.css';  // Make sure to link the CSS file.

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the user data
    const userData = {
      username,
      email,
      password,
    };

    // Send the POST request to the backend
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`User created: ${data.user.username}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while connecting to the server');
    }
  };

  return (
    <div className="register-container">
      <div className="card-container">
        <div className="card" style={{ borderRadius: '15px' }}>
          <div className="card-body p-5">
            <h2 className="text-uppercase text-center mb-5">Create an account</h2>

            <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="form3Example1cg">Enter username</label>
              <div className="form-outline mb-4">
                <input
                  type="text"
                  id="form3Example1cg"
                  className="form-control form-control-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <label className="form-label" htmlFor="form3Example3cg">Enter Email</label>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3cg"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <label className="form-label" htmlFor="form3Example3cg">Enter Password</label>
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form3Example4cg"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-success btn-block btn-lg gradient-custom-4 text-body">
                  Register
                </button>
              </div>

              <p className="text-center text-muted mt-5 mb-0">
                Have already an account? <a href="/login" className="fw-bold text-body"><u>Login here</u></a>
              </p>
            </form>

            {message && <p className="text-center text-muted mt-4">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
