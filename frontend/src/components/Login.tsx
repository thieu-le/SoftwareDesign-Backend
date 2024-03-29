import React, { useState } from 'react';
import apiService from '../services/apiService'; // Import the apiService

interface LoginProps {
  onLoginSuccess: (username: string, password: string) => void; // Update the function signature
  onRegister: () => void;
}


const Login: React.FC<LoginProps> = ({ onLoginSuccess, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make API request to login
      await apiService.login(username, password);
      setLoading(false);
      onLoginSuccess(username, password); // Call onLoginSuccess if login is successful
    } catch (error) {
      // Handle login error
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" onClick={onRegister}>Register</button>
      </form>
    </div>
  );
};

export default Login;
