import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BankContext } from '../context/BankContext';
import './Navbar.css';

const Navbar = () => {
  const { currentBank, setCurrentBank } = useContext(BankContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentBank(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Chakravyuh AI</div>
      {currentBank && (
        <div className="navbar-info">
          <span>{currentBank === 'bankA' ? 'Demo Bank A' : 'Demo Bank B'}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
