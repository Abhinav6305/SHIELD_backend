import React from 'react';
import { useNavigate } from 'react-router-dom';

function OnboardingPage() {
  const navigate = useNavigate();

  const handleAddAccounts = () => {
    // simulate linking accounts
    localStorage.setItem('linkedAccounts', 'true');
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Link Customer Accounts</h2>

      <p>
        Upload transaction data or connect your core banking system
        to start fraud analysis.
      </p>

      <button
        onClick={handleAddAccounts}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
      >
        Simulate Account Linking
      </button>
    </div>
  );
}

export default OnboardingPage;
