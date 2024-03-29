import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProfileForm from './components/ProfileForm';
import FuelQuoteForm from './components/FuelQuoteForm';
import FuelQuoteHistory from './components/FuelQuoteHistory';

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSubmit = (username: string, password: string) => {
    // Logic for handling login
  };

  const handleRegisterSubmit = (username: string, password: string) => {
    // Logic for handling registration
  };


  const handleToggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSubmit} onRegister={handleToggleForm} />} />
          <Route path="/register" element={<Register onSubmit={handleRegisterSubmit} onLogin={handleToggleForm} />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="/fuelquoteform" element={<FuelQuoteForm clientProfile={{ deliveryAddress: '123 Main St' }} />} />
          <Route path="/fuelquotehistory" element={<FuelQuoteHistory />} />        
        </Routes>
      </Router>
    </div>
  );
};

export default App;
