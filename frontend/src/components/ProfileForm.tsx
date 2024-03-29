import React, { useState } from 'react';
import apiService from '../services/apiService'; // Import the apiService

const ProfileForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the API service function to send profile data to the backend
      await apiService.sendProfileData({
        fullName,
        address1,
        address2,
        city,
        state,
        zipcode
      });
      // Handle success or redirect to another page if needed
      console.log('Profile data sent successfully');
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error('Error submitting profile data:', error);
    }
  };

  // List of all 50 states plus Texas
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Profile Management</h2>
      <div>
        <label htmlFor="fullName">Full Name (Max 50 characters):</label>
        <input
          type="text"
          id="fullName"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={50}
          required
        />
      </div>
      <div>
        <label htmlFor="address1">Address 1 (Max 100 characters):</label>
        <input
          type="text"
          id="address1"
          placeholder="Address 1"
          value={address1}
          onChange={(e) => setAddress1(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div>
        <label htmlFor="address2">Address 2 (Max 100 characters):</label>
        <input
          type="text"
          id="address2"
          placeholder="Address 2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
          maxLength={100}
        />
      </div>
      <div>
        <label htmlFor="city">City (Max 100 characters):</label>
        <input
          type="text"
          id="city"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={100}
          required
        />
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <select id="state" value={state} onChange={(e) => setState(e.target.value)} required>
          <option value="">Select State</option>
          {states.map((stateOption, index) => (
            <option key={index} value={stateOption}>{stateOption}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="zipcode">Zipcode (Min 5 characters):</label>
        <input
          type="text"
          id="zipcode"
          placeholder="Zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          minLength={5}
          required
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default ProfileForm;
