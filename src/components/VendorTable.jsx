import React from 'react';

function VendorTable({ vendors, onSelect }) {
  if (!vendors || vendors.length === 0) {
    return <div style={{ padding: '1rem', color: '#666' }}>No vendors evaluated yet.</div>;
  }

  return (
    <table className="card">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Vendor Name</th>
          <th>Total Score</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {vendors.map((vendor, index) => (
          <tr key={vendor.id || index}>
            <td>{index + 1}</td>
            <td>{vendor.name}</td>
            <td>{vendor.total_score}</td>
            <td>
              <span className={`badge ${vendor.status === 'Qualified' ? 'badge-success' : 'badge-error'}`}>
                {vendor.status}
              </span>
            </td>
            <td>
              <button 
                className="btn" 
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                onClick={() => onSelect(vendor.id)}
              >
                View Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VendorTable;
