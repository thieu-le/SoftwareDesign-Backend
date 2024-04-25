import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await apiService.getCsrfToken();
        setCsrfToken(token);
        console.log('CSRF token:', token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
        setError('Error fetching CSRF token. Please try again.');
      }
    };

    fetchCsrfToken();
  }, []); // Fetch CSRF token only once when component mounts

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!username || !password || !confirmPassword) {
      setError('Username, password, and confirmation are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirmation do not match.');
      setLoading(false);
      return;
    }

    try {
      const registrationResult = await apiService.registerUser(username, password, csrfToken);
      console.log('Registration result:', registrationResult); // Log registration result
      setLoading(false);
      // Check if the response contains the 'message' key and display it
      if (registrationResult && registrationResult.message) {
        console.log(registrationResult.message); // Log the success message
        // Redirect to login page after successful registration
        window.location.href = '/login';
      }
    } catch (error) {
      setError('Error registering user. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};

export default Register;
