import React, { useState } from 'react';
import apiService from '../services/apiService'; // Import the apiService
import './styles.css';

interface StateObject {
  name: string; // State name
  pk: number;   // Primary key value
}

const ProfileForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  const states: StateObject[] = [
    { name: 'Alabama', pk: 1 },
    { name: 'Alaska', pk: 2 },
    { name: 'Arizona', pk: 3 },
    { name: 'Arkansas', pk: 4 },
    { name: 'California', pk: 5 },
    { name: 'Colorado', pk: 6 },
    { name: 'Connecticut', pk: 7 },
    { name: 'Delaware', pk: 8 },
    { name: 'Florida', pk: 9 },
    { name: 'Georgia', pk: 10 },
    { name: 'Hawaii', pk: 11 },
    { name: 'Idaho', pk: 12 },
    { name: 'Illinois', pk: 13 },
    { name: 'Indiana', pk: 14 },
    { name: 'Iowa', pk: 15 },
    { name: 'Kansas', pk: 16 },
    { name: 'Kentucky', pk: 17 },
    { name: 'Louisiana', pk: 18 },
    { name: 'Maine', pk: 19 },
    { name: 'Maryland', pk: 20 },
    { name: 'Massachusetts', pk: 21 },
    { name: 'Michigan', pk: 22 },
    { name: 'Minnesota', pk: 23 },
    { name: 'Mississippi', pk: 24 },
    { name: 'Missouri', pk: 25 },
    { name: 'Montana', pk: 26 },
    { name: 'Nebraska', pk: 27 },
    { name: 'Nevada', pk: 28 },
    { name: 'New Hampshire', pk: 29 },
    { name: 'New Jersey', pk: 30 },
    { name: 'New Mexico', pk: 31 },
    { name: 'New York', pk: 32 },
    { name: 'North Carolina', pk: 33 },
    { name: 'North Dakota', pk: 34 },
    { name: 'Ohio', pk: 35 },
    { name: 'Oklahoma', pk: 36 },
    { name: 'Oregon', pk: 37 },
    { name: 'Pennsylvania', pk: 38 },
    { name: 'Rhode Island', pk: 39 },
    { name: 'South Carolina', pk: 40 },
    { name: 'South Dakota', pk: 41 },
    { name: 'Tennessee', pk: 42 },
    { name: 'Texas', pk: 43 },
    { name: 'Utah', pk: 44 },
    { name: 'Vermont', pk: 45 },
    { name: 'Virginia', pk: 46 },
    { name: 'Washington', pk: 47 },
    { name: 'West Virginia', pk: 48 },
    { name: 'Wisconsin', pk: 49 },
    { name: 'Wyoming', pk: 50 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map form data to match ClientProfileSerializer fields
      const profileData = {
        full_name: fullName,
        address1,
        address2,
        city,
        state: getStatePK(state), // Map state value to its primary key value
        zipcode
      };
  
      // Call the API service function to send profile data to the backend
      await apiService.sendProfileData(profileData, csrfToken);
  
      // Handle success or redirect to another page if needed
      console.log('Profile data sent successfully');
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error('Error submitting profile data:', error);
    }
  };
  
  // Function to get the primary key value of the selected state
  const getStatePK = (stateName: string): number | undefined => {
    const stateObj = states.find((stateObj) => stateObj.name === stateName);
    return stateObj ? stateObj.pk : undefined;
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Profile Management</h2>
      <div>
        <label htmlFor="fullName">Full Name (Max 50 characters)</label>
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
        <label htmlFor="address1">Address 1 (Max 100 characters)</label>
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
        <label htmlFor="address2">Address 2 (Max 100 characters)</label>
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
        <label htmlFor="city">City (Max 100 characters)</label>
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
        <label htmlFor="state">State</label>
        <select id="state" value={state} onChange={(e) => setState(e.target.value)} required>
          <option value="">Select State</option>
          {states.map((stateObj, index) => (
            <option key={index} value={stateObj.name}>{stateObj.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="zipcode">Zipcode (Min 5 characters)</label>
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
