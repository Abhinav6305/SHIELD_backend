import React from 'react';
import './AccountDetails.css';

const AccountDetails = ({ account }) => {
  if (!account) {
    return (
      <div className="account-details">
        <h3>Account Details</h3>
        <p>Click on a node or row to view details.</p>
      </div>
    );
  }

  return (
    <div className="account-details">
      <h3>Account Details</h3>
      <p><strong>ID:</strong> {account.id}</p>
      <p className="risk-score">
        <strong>Risk Score:</strong> {account.risk_score.toFixed(2)}
        <span className={`risk-level ${account.risk_level.toLowerCase()}`}>{account.risk_level}</span>
      </p>
      <div className="explanation">
        <strong>Explanation:</strong>
        <ul>
          {account.explanation.map((reason, index) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountDetails;
