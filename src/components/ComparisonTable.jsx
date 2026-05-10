import React from 'react';

const ComparisonTable = ({ bids }) => {
  if (bids.length === 0) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'found': return <span className="status-icon status-found">✅</span>;
      case 'partial': return <span className="status-icon status-partial">⚠️</span>;
      case 'unclear': return <span className="status-icon status-unclear">⚠️</span>;
      case 'not_found': return <span className="status-icon status-not_found">❌</span>;
      case 'missing': return <span className="status-icon status-not_found">❌</span>;
      default: return <span className="status-icon">❓</span>;
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    // Convert to Crores if large, else Lakhs? For now just raw + Cr/Lakh logic or simple K/M
    // MVP: Value is extracted as float, assume text has unit. 
    // If backend normalized to INR, let's display nicely.
    // 1 Crore = 10,000,000
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Bid Comparison</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Parameter</th>
            {bids.map((bid, i) => (
              <th key={i} style={{ padding: '1rem', textAlign: 'left' }}>{bid.vendor_name || `Vendor ${i+1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Turnover */}
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Annual Turnover</td>
            {bids.map((bid, i) => (
              <td key={i} style={{ padding: '1rem' }}>
                <div className="status-icon">
                  {getStatusIcon(bid.turnover.status)}
                  <span>{formatCurrency(bid.turnover.value)}</span>
                </div>
                {bid.turnover.original_text && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    "{bid.turnover.original_text.substring(0, 50)}..."
                  </div>
                )}
              </td>
            ))}
          </tr>
          
          {/* ISO Certification */}
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ISO 9001</td>
            {bids.map((bid, i) => (
              <td key={i} style={{ padding: '1rem' }}>
                <div className="status-icon">
                  {bid.certification.has_iso_9001 ? getStatusIcon('found') : getStatusIcon('not_found')}
                  <span>{bid.certification.has_iso_9001 ? 'Yes' : 'No'}</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Experience */}
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Experience</td>
            {bids.map((bid, i) => (
              <td key={i} style={{ padding: '1rem' }}>
                <div className="status-icon">
                  {getStatusIcon(bid.experience.status)}
                  <span>{bid.experience.project_count || 0} Projects</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Delivery Timeline */}
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Delivery Timeline</td>
            {bids.map((bid, i) => (
              <td key={i} style={{ padding: '1rem' }}>
                <div className="status-icon">
                  {getStatusIcon(bid.delivery.status)}
                  <span>{bid.delivery.days ? `${bid.delivery.days} Days` : 'Unknown'}</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Admin Docs */}
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Legal & Admin</td>
            {bids.map((bid, i) => (
              <td key={i} style={{ padding: '1rem' }}>
                 <div className="status-icon">
                   {getStatusIcon(bid.admin_docs.status)}
                   <span>
                     {[
                       bid.admin_docs.has_gst && 'GST',
                       bid.admin_docs.has_pan && 'PAN',
                       bid.admin_docs.has_emd && 'EMD'
                     ].filter(Boolean).join(', ') || 'None'}
                   </span>
                 </div>
                 {bid.admin_docs.missing_docs && bid.admin_docs.missing_docs.length > 0 && (
                   <div style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
                     Missing: {bid.admin_docs.missing_docs.join(', ')}
                   </div>
                 )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
