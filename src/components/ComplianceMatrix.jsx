import React from 'react';

const ComplianceMatrix = ({ bids }) => {
  if (!bids || bids.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No data available. Upload bids first.</div>;

  const getStatusPill = (status, text) => {
    let type = 'pill-red';
    let icon = '❌';
    let label = text || 'Missing';

    if (status === 'found') {
      type = 'pill-green';
      icon = '✅';
      label = text || 'Compliant';
    } else if (status === 'partial' || status === 'unclear') {
      type = 'pill-yellow';
      icon = '⚠️';
      label = text || 'Partial';
    } else if (status === 'provisional') {
      type = 'pill-blue'; // Or yellow, but blue distinguishes "System Pass" vs "Warning"
      icon = '🔵';
      label = text || 'Provisional';
    }

    return (
      <span className={`pill ${type}`}>
        <span>{icon}</span>
        <span>{label}</span>
      </span>
    );
  };

  const getEvidence = (item) => {
    if (!item) return null;
    return item.original_text || item.evidence || "No specific evidence cited.";
  };

  // Define rows based on our 5 fixed parameters
  const rows = [
    {
      id: 'R1',
      title: 'Annual Turnover', 
      key: 'turnover',
      render: (bid) => {
        const val = bid.turnover.value 
         ? (bid.turnover.value >= 10000000 ? `₹${(bid.turnover.value/10000000).toFixed(2)} Cr` : `₹${(bid.turnover.value/100000).toFixed(2)} L`)
         : 'Unknown';
        return getStatusPill(bid.turnover.status, val);
      }
    },
    {
      id: 'R2',
      title: 'ISO 9001 Certification',
      key: 'certification',
      render: (bid) => getStatusPill(
        bid.certification.has_iso_9001 ? 'found' : 'not_found', 
        bid.certification.has_iso_9001 ? 'ISO 9001 Valid' : 'Missing Cert'
      )
    },
    {
      id: 'R3',
      title: 'Relevant Experience',
      key: 'experience',
      render: (bid) => getStatusPill(
         bid.experience.status,
         `${bid.experience.project_count || 0} Projects`
      )
    },
    {
       id: 'R4',
       title: 'Delivery Timeline',
       key: 'delivery',
       render: (bid) => getStatusPill(
         bid.delivery.status,
         bid.delivery.days ? `${bid.delivery.days} Days` : 'Timeline Unclear'
       )
    },
    {
      id: 'R5',
      title: 'Legal & Admin Docs',
      key: 'admin_docs',
      render: (bid) => {
        const missing = bid.admin_docs.missing_docs || [];
        const label = missing.length > 0 ? `Missing: ${missing.length}` : 'All Docs Present';
        let status = bid.admin_docs.status;
        if (label === 'All Docs Present' && (status === 'not_found' || status === 'error')) {
            status = 'provisional'; 
        }
        return getStatusPill(status, label);
      }
    },
    {
      id: 'R6', title: 'EMD / Bid Security', key: 'emd',
      render: (bid) => getStatusPill(bid.emd.status, bid.emd.amount ? `₹${bid.emd.amount}` : (bid.emd.status === 'found' ? 'Submitted' : 'Missing'))
    },
    {
      id: 'R7', title: 'Blacklisting Declaration', key: 'blacklisting',
      render: (bid) => getStatusPill(bid.blacklisting.status, bid.blacklisting.status === 'found' ? 'Not Blacklisted' : 'Missing Decl')
    },
    {
      id: 'R8', title: 'Warranty Commitment', key: 'warranty',
      render: (bid) => getStatusPill(bid.warranty.status, bid.warranty.duration_months ? `${bid.warranty.duration_months} Months` : 'Unclear')
    },
    {
      id: 'R9', title: 'Solvency Proof', key: 'solvency',
      render: (bid) => getStatusPill(bid.solvency.status, bid.solvency.amount ? `₹${bid.solvency.amount}` : 'Check Doc')
    },
    {
      id: 'R10', title: 'Make In India (MII)', key: 'mii',
      render: (bid) => getStatusPill(bid.mii.status, bid.mii.class_type || 'Undeclared')
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Clause × Vendor Compliance Matrix</h3>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Status per requirement for each vendor with evidence-backed verdicts.
          </p>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Show only mandatory</button>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '800px' }}>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Requirement</th>
              {bids.map((bid, i) => (
                <th key={i} style={{ width: `${75 / bids.length}%` }}>
                  {bid.vendor_name || `Vendor ${i+1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.id} – {row.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Mandatory • High Weight</div>
                </td>
                {bids.map((bid, i) => (
                  <td key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                      {row.render(bid)}
                      
                      {/* Evidence Tooltip/Text (Simple version) */}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3', maxWidth: '280px' }}>
                         {getEvidence(bid[row.key])}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceMatrix;
