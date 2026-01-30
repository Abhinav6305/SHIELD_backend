import React from 'react';
import { useNavigate } from 'react-router-dom';

function BankDashboard() {
  const navigate = useNavigate();
  const bank = localStorage.getItem('bank');
  const linked = localStorage.getItem('linkedAccounts') === 'true';

  return (
    <div style={{ padding: '40px' }}>
      <h1>Welcome, {bank}</h1>

      {!linked ? (
        <div style={{ marginTop: '40px' }}>
          <h3>Dear Bank,</h3>
          <p>
            You have not linked any customer accounts yet.
            Please add users so that we can analyze transactions and detect fraud.
          </p>

          <button
            onClick={() => navigate('/onboarding')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
          >
            Add / Link Accounts
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '40px' }}>
          <h3>Accounts Linked Successfully</h3>
          <p>You can now analyze transactions and investigate fraud.</p>

          <button
            onClick={() => navigate('/investigate')}
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
          >
            Open Fraud Investigation
          </button>
        </div>
      )}
    </div>
  );
}

export default BankDashboard;
