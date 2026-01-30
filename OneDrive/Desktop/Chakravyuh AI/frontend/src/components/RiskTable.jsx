import React from 'react';
import './RiskTable.css';

const RiskTable = ({ nodes, onRowClick }) => {
  const sortedNodes = [...nodes].sort((a, b) => b.risk_score - a.risk_score);

  return (
    <div className="risk-table">
      <h3>Risk Scores</h3>
      <table>
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {sortedNodes.map(node => (
            <tr key={node.id} onClick={() => onRowClick(node.id)} className="clickable-row">
              <td>{node.id}</td>
              <td>{node.risk_score.toFixed(2)}</td>
              <td className={`risk-level ${node.risk_level.toLowerCase()}`}>{node.risk_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
