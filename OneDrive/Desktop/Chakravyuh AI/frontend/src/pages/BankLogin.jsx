import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankContext } from '../context/BankContext';
import './BankLogin.css';

const BankLogin = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const { setCurrentBank } = useContext(BankContext);
  const navigate = useNavigate();

  const handleSelectBank = () => {
    if (selectedBank) {
      setCurrentBank(selectedBank);
      navigate('/dashboard');
    }
  };

  return (
    <div className="bank-login">
      <h2>Select Your Bank</h2>
      <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
        <option value="">Choose a bank</option>
        <option value="bankA">Demo Bank A</option>
        <option value="bankB">Demo Bank B</option>
      </select>
      <button onClick={handleSelectBank} disabled={!selectedBank}>Login</button>
    </div>
  );
};

export default BankLogin;
