import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });

      console.log("This is the token:", response.data.token);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        if (setToken) {
          setToken(response.data.token);
        }
      } else {
        setErrorMessage("Login successful, but token not received!");
        return;
      }

      navigate("/");
      window.location.reload();

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed! Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box className="login-container">
        <Typography className="login-heading">Login to Movie App</Typography>
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-field"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-field"
          />

          {errorMessage && <Typography className="error-message">{errorMessage}</Typography>}

          <Button type="submit" fullWidth variant="contained" className="login-button">
            Log In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
