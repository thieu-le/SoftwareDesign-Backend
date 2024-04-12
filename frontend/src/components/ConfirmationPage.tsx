import React, { useState } from 'react';
import apiService from '../services/apiService';
import './styles.css';

const ConfirmationPage: React.FC = () => {
  return (
    <div className="confirmation-page"> {/* Add a class to the wrapper div */}
      <h2>Registration Successful!</h2>
      <p>Your registration has been successfully completed.</p>
      <p>Thank you!</p>
    </div>
  );
};

export default ConfirmationPage;
