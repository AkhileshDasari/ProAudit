import React from 'react';

function ClauseTable({ clauses }) {
  if (!clauses || clauses.length === 0) {
    return <div>No compliance details available.</div>;
  }

  return (
    <div className="card">
      <h3>Compliance Breakdown</h3>
      <table>
        <thead>
          <tr>
            <th style={{ width: '15%' }}>Clause ID</th>
            <th style={{ width: '30%' }}>Requirement</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '40%' }}>Evidence / Quote</th>
          </tr>
        </thead>
        <tbody>
          {clauses.map((clause, index) => (
            <tr key={index} style={{ backgroundColor: clause.status === 'Non-Compliant' ? '#fff1f2' : 'inherit' }}>
              <td>{clause.id}</td>
              <td style={{ fontSize: '0.9rem' }}>{clause.text}</td>
              <td>
                <span className={`badge ${clause.status === 'Compliant' ? 'badge-success' : 'badge-error'}`}>
                  {clause.status}
                </span>
              </td>
              <td style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#475569' }}>
                "{clause.evidence}"
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClauseTable;
