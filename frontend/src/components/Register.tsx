import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import './styles.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    // Fetch CSRF token after a short delay to ensure the DOM is fully rendered
    const delay = setTimeout(() => {
      const token = getCsrfToken();
      setCsrfToken(token);
    }, 100); // Adjust the delay time as needed
  
    return () => clearTimeout(delay); // Clear the timeout on unmount
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      if (!username || !password || !confirmPassword) {
        throw new Error('Username, password, and confirmation are required.');
      }
      
      if (password !== confirmPassword) { // Ensure passwords match
        throw new Error('Password and confirmation do not match.');
      }
  
      const csrfToken = getCsrfToken(); // Get CSRF token just before making the API call
      console.log('Username:', username);
      console.log('Password:', password);
      console.log('Confirm Password:', confirmPassword);
      console.log('CSRF Token:', csrfToken);
  
      await apiService.registerUser(username, password, csrfToken);
      setLoading(false);
      // Redirect or perform any necessary action upon successful registration
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleFormSubmit} action="/register/" method="post">
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
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
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;

function getCsrfToken() {
  const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement;
  return csrfTokenElement ? csrfTokenElement.value : '';
}
