import React from 'react';

const SidebarStats = ({ bids, processingTime }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Scenario Card */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scenario</h4>
        <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>
          Government IT infrastructure tender with <strong>{bids.length} vendor bids</strong>.
        </p>
      </div>

      {/* File List */}
      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Ingested Documents
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           {/* Generic Tender Icon */}
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
             <span style={{ color: 'var(--text-muted)' }}>📄</span>
             <span>Current_Tender_Docs.pdf</span>
           </div>
           
           {/* Vendor Bids */}
           {bids.map((bid, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--accent-primary)' }}>📄</span>
                <span style={{ color: 'var(--accent-primary)' }}>
                   {bid.vendor_name ? `${bid.vendor_name}.pdf` : `Bid_${i+1}.pdf`}
                </span>
             </div>
           ))}
        </div>
      </div>
      
      {/* Processing Time */}
      {processingTime && (
        <div style={{ fontSize: '0.8rem', color: 'var(--status-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <span>⏱️</span>
           <span>Processed in {processingTime.toFixed(1)}s</span>
        </div>
      )}
    </div>
  );
};

export default SidebarStats;
