import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const data = await apiService.login(username, password);
      setLoading(false);
      // Check if the response contains the 'message' key and display it
      if (data && data.message) {
        console.log(data.message); // Log the success message
        // Redirect or perform any other necessary action upon successful login
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
