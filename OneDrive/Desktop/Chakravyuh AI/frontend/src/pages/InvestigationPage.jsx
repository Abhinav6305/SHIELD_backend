import React, { useState } from 'react';
import NetworkGraph from '../components/NetworkGraph';
import RiskTable from '../components/RiskTable';
import AccountDetails from '../components/AccountDetails';
import './InvestigationPage.css';

const InvestigationPage = () => {
  const currentBank = localStorage.getItem('bank');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Mock data for demonstration
  const mockNodes = [
    { id: 'acc1', risk_score: 0.8, risk_level: 'High', explanation: ['High proximity to fraud', 'Many fraud neighbors'] },
    { id: 'acc2', risk_score: 0.4, risk_level: 'Medium', explanation: ['Moderate centrality', 'Some shared IPs'] },
    { id: 'acc3', risk_score: 0.1, risk_level: 'Low', explanation: ['Low connectivity', 'No fraud links'] },
  ];

  const mockEdges = [
    { source: 'acc1', target: 'acc2', type: 'transaction', amount: 1000, timestamp: '2023-01-01' },
    { source: 'acc2', target: 'acc3', type: 'ip_shared', ip: '192.168.1.1' },
  ];

  return (
    <div className="investigation-page">
      <h2>Fraud Investigation - {currentBank}</h2>
      <div className="dashboard">
        <div className="graph-section">
          <NetworkGraph nodes={mockNodes} edges={mockEdges} onNodeClick={setSelectedAccount} />
        </div>
        <div className="table-section">
          <RiskTable nodes={mockNodes} onRowClick={setSelectedAccount} />
        </div>
        <div className="details-section">
          <AccountDetails account={selectedAccount} />
        </div>
      </div>
    </div>
  );
};

export default InvestigationPage;
