import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import FuelQuoteForm from './components/FuelQuoteForm';
import FuelQuoteHistory from './components/FuelQuoteHistory';
import ConfirmationPage from './components/ConfirmationPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/fuelquoteform" element={<FuelQuoteForm clientProfile={{ deliveryAddress: '123 Main St' }} />} />
          <Route path="/fuelquotehistory" element={<FuelQuoteHistory />} />        
          <Route path="/confirmationpage" element={<ConfirmationPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
