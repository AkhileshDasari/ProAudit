import React, { useEffect, useState } from 'react';
import ClauseTable from '../components/ClauseTable';
import { api } from '../api/api';

function VendorDetail({ vendorId, onBack }) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!vendorId) return;
      try {
        const data = await api.getVendorDetail(vendorId);
        setVendor(data);
      } catch (err) {
        setError('Failed to load vendor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [vendorId]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div style={{ color: 'red' }}>{error} <br/> <button onClick={onBack} className="btn" style={{marginTop:'1rem'}}>Go Back</button></div>;
  if (!vendor) return <div>Vendor not found.</div>;

  return (
    <div>
      <button 
        onClick={onBack} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', marginBottom: '1rem', padding: 0 }}
      >
        ← Back to Ranking
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>{vendor.name}</h1>
          <div style={{ color: '#666' }}>Vendor ID: {vendor.id}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {vendor.total_score}%
          </div>
          <div className={`badge ${vendor.status === 'Qualified' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '1rem' }}>
            {vendor.status}
          </div>
        </div>
      </div>

      <ClauseTable clauses={vendor.clauses} />
    </div>
  );
}

export default VendorDetail;
