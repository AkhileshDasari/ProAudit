import React from 'react';

const DashboardLayout = ({ children, sidebarContent }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '320px', 
        background: 'var(--bg-panel)', 
        borderRight: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div className="logo-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)' }}></div>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>ProcureAudit AI</h2>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated tender & bid compliance
          </p>
        </div>

        {sidebarContent}

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
           <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>v0.1 MVP • Read-only demo</p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: 'var(--bg-app)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
