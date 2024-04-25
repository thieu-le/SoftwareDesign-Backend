import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await apiService.getCsrfToken();
        setCsrfToken(token);
        console.log('CSRF token:', token); // Log the CSRF token
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

    try {
      const data = await apiService.login(username, password, csrfToken);
      setLoading(false);
      // Check if the response contains the 'message' key and display it
      if (data && data.message) {
        console.log(data.message); // Log the success message
        // Save user ID to sessionStorage
        sessionStorage.setItem('user_id', data.user_id);
        // Redirect to /profile upon successful login
        window.location.href = '/profile/?user_id=' + data.user_id;
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <Link to="/register">Register</Link>
      </form>
    </div>
  );
};

export default Login;
