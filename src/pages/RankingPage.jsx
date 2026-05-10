import React, { useEffect, useState } from 'react';
import VendorTable from '../components/VendorTable';
import { api } from '../api/api';

function RankingPage({ onVendorSelect }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getResults();
        // Assuming data is { vendors: [...] } or just [...]
        // Adjusting based on potential API response structure. 
        // If the API returns directly an array, we use it. If it returns an object with a key, we access it.
        // For safety, let's assume it returns an array of vendors or an object wrapping it.
        const list = Array.isArray(data) ? data : (data.vendors || []);
        setVendors(list);
      } catch (err) {
        setError('Failed to load results. Please ensure evaluation has been run.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <div>Loading results...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Vendor Rankings</h1>
      <p style={{ marginBottom: '1.5rem' }}>Based on compliance score against tender requirements.</p>
      
      <VendorTable vendors={vendors} onSelect={onVendorSelect} />
    </div>
  );
}

export default RankingPage;
