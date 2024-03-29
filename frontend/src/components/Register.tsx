import React, { useState } from 'react';
import apiService from '../services/apiService'; // Import the apiService

interface RegisterProps {
  onSubmit: (username: string, password: string) => void;
  onLogin: () => void; // New property for the login function
}

const Register: React.FC<RegisterProps> = ({ onSubmit, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the registerUser API function with the username and password
      await apiService.registerUser(username, password);
      // If registration is successful, call the onSubmit function (passed from parent component)
      onSubmit(username, password);
    } catch (error) {
      // Handle registration error (e.g., display error message)
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
        <button type="submit">Register</button>
        <button type="button" onClick={onLogin}>Login</button> {/* Button to trigger the login function */}
      </form>
    </div>
  );
};

export default Register;
