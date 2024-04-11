import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import apiService from '../services/apiService';
import './styles.css';

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
      await apiService.login(username, password);
      setLoading(false);
      // Redirect or perform any necessary action upon successful login
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
            placeholder = 'Password'
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} className="login-button">{loading ? 'Logging in...' : 'Login'} 
        </button>
        {/* Link to the Register page styled as a button */}
        <Link to="/register" className="register-button" style={{ marginLeft: '10px', marginTop: '10px' }}>Register</Link>
      </form>
    </div>
  );
};

export default Login;
