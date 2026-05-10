import React from 'react';

const ScoringRanking = ({ bids }) => {
  if (!bids || bids.length === 0) return null;

  // Simple scoring logic for MVP
  // +20 per passed parameter (5 params total = 100 max)
  const calculateScore = (bid) => {
    let score = 0;
    if (bid.turnover.status === 'found') score += 20;
    if (bid.certification.has_iso_9001) score += 20;
    if (bid.experience.status === 'found') score += 20;
    if (bid.delivery.status === 'found' && bid.delivery.days < 90) score += 20; // Bonus for fast delivery?
    if (bid.admin_docs.status === 'found') score += 20;
    
    // Cap at 100 in case logic changes
    return Math.min(score, 100);
  };

  const rankedBids = [...bids].map(bid => ({
    ...bid,
    score: calculateScore(bid)
  })).sort((a, b) => b.score - a.score);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ margin: 0 }}>Vendor Scores & Ranking</h3>
        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Hybrid of deterministic checks and AI reasoning.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
         <table style={{ width: '100%' }}>
            <thead>
               <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ width: '10%' }}>Rank</th>
                  <th style={{ width: '30%' }}>Vendor</th>
                  <th style={{ width: '15%' }}>Tech Score</th>
                  <th style={{ width: '15%' }}>Compliance</th>
                  <th style={{ width: '30%' }}>Summary</th>
               </tr>
            </thead>
            <tbody>
               {rankedBids.map((bid, index) => (
                 <tr key={index}>
                    <td style={{ textAlign: 'center' }}>
                       <span style={{ 
                         display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                         width: '32px', height: '32px', borderRadius: '50%',
                         background: index === 0 ? 'var(--accent-primary)' : 'var(--bg-card)',
                         color: index === 0 ? 'white' : 'var(--text-muted)',
                         fontWeight: 'bold'
                       }}>
                         #{index + 1}
                       </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{bid.vendor_name}</div>
                    </td>
                    <td>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{bid.score}/100</span>
                          <div style={{ flex: 1, height: '4px', background: 'var(--bg-card)', borderRadius: '2px' }}>
                             <div style={{ width: `${bid.score}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                          </div>
                       </div>
                    </td>
                    <td>
                       <span style={{ color: bid.score > 80 ? 'var(--status-green)' : 'var(--status-yellow)' }}>
                          {bid.score > 80 ? 'High' : 'Medium'}
                       </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                       {bid.score === 100 ? 'Excellent compliance across all parameters.' : 
                        bid.score > 60 ? 'Meets most requirements but has gaps.' : 'Significant compliance issues found.'}
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default ScoringRanking;
