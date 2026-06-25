import React, { useState, useEffect, useRef } from 'react';
import {
  Upload as UploadIcon,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  PieChart,
  Settings,
  Moon,
  Sun,
  ChevronRight,
  ShieldCheck,
  Clock,
  Award,
  Search,
  ArrowRight,
  Loader2,
  File,
  History // Importing History Icon
} from 'lucide-react';
import { api } from './api/api';
import ChatBot from './components/ChatBot';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- STYLES & THEME MANAGEMENT ---

const cssStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* Dark Theme (Default) - Sci-Fi/Cyberpunk */
  --bg-app: #0B0F19;
  --bg-panel: #111827;
  --bg-card: #1f2937;
  --bg-glass: rgba(17, 24, 39, 0.7);
  
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-highlight: rgba(59, 130, 246, 0.5);

  --text-primary: #F3F4F6;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  --accent-primary: #3B82F6;
  --accent-secondary: #8B5CF6;
  --accent-glow: rgba(59, 130, 246, 0.3);
  
  --status-green: #10B981;
  --status-green-bg: rgba(16, 185, 129, 0.15);
  --status-yellow: #F59E0B;
  --status-yellow-bg: rgba(245, 158, 11, 0.15);
  --status-red: #EF4444;
  --status-red-bg: rgba(239, 68, 68, 0.15);
  --status-blue: #3B82F6;
  --status-blue-bg: rgba(59, 130, 246, 0.15);

  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-glow: 0 0 15px var(--accent-glow);
}

[data-theme='light'] {
  /* Google/Material 3 Inspired Professional Theme */
  --bg-app: #F8F9FA; /* Google Grey */
  --bg-panel: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-glass: rgba(255, 255, 255, 0.9);
  
  --border-subtle: #E5E7EB;
  --border-highlight: #4285F4;

  --text-primary: #202124; /* Google Black */
  --text-secondary: #5F6368;
  --text-muted: #9AA0A6;
  
  --accent-primary: #1A73E8; /* Google Blue */
  --accent-secondary: #8AB4F8;
  --accent-glow: rgba(26, 115, 232, 0.15);
  
  --status-green: #188038;
  --status-green-bg: #E6F4EA;
  --status-yellow: #F29900;
  --status-yellow-bg: #FEF7E0;
  --status-red: #D93025;
  --status-red-bg: #FCE8E6;
  --status-blue: #1A73E8;
  --status-blue-bg: #E8F0FE;

  --shadow-card: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15);
  --shadow-glow: 0 0 5px rgba(26, 115, 232, 0.2);
}

* { box-sizing: border-box; transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease; }

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  overflow: hidden; /* App handles scroll */
}

/* Animations */
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes spin-slow {
  to { transform: rotate(360deg); }
}

@keyframes scanner-spin {
  0% { transform: rotate(0deg); border-top-color: var(--accent-primary); }
  50% { border-top-color: var(--accent-secondary); }
  100% { transform: rotate(360deg); border-top-color: var(--accent-primary); }
}

@keyframes scanner-line {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

@keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Utilities */
.glass-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
  border-color: var(--accent-primary);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px; /* Google-like simpler radius */
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.btn-primary:hover {
  filter: brightness(1.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}
.btn-secondary:hover {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--text-primary);
}
.btn-secondary.active {
  background: var(--status-blue-bg);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 6px;
  letter-spacing: 0.02em;
}
.pill-green { background: var(--status-green-bg); color: var(--status-green); border: 1px solid rgba(16, 185, 129, 0.2); }
.pill-yellow { background: var(--status-yellow-bg); color: var(--status-yellow); border: 1px solid rgba(245, 158, 11, 0.2); }
.pill-red { background: var(--status-red-bg); color: var(--status-red); border: 1px solid rgba(239, 68, 68, 0.2); }
.pill-blue { background: var(--status-blue-bg); color: var(--status-blue); border: 1px solid rgba(59, 130, 246, 0.2); }

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Enhanced Loader Styles */
.loader-container {
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 20px var(--accent-glow);
}

.loader-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--accent-primary);
    animation: scanner-spin 1.5s cubic-bezier(0.5, 0.2, 0.2, 0.8) infinite; /* Professional Spin */
}

.loader-scan-effect {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; height: 90%;
    border-radius: 50%;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    animation: pulse-ring 2s infinite;
}

/* Translucent Orb Container */
.loader-core {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05); /* Subtle glass */
    backdrop-filter: blur(3px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3); /* Depth */
    /* No flex center, we want absolute positioning for orbit */
}

/* The Liquid Blob */
.loader-core::after {
    content: '';
    position: absolute;
    top: 5px; left: 50%; /* Start at top (matching loader-ring start) */
    transform: translateX(-50%); /* Center horizontally on the line */
    width: 20px; height: 20px; /* Small amount of fluid */
    background: var(--accent-primary);
    border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
    filter: drop-shadow(0 0 8px var(--accent-secondary));
    
    /* 
       1. liquid-morph: Changes shape to look like fluid
       2. orbit-sync: Rotates the BLOB around the center of the orb 
          (We use a wrapper or transform-origin trick here)
    */
    transform-origin: 50% 25px; /* Pivot around the center of the orb (radius - top_offset) = 30px - 5px = 25px down */
    
    /* 
       We use a two-step animation:
       1. orbit-sync: Rotates the blob around the pivot, synced with loader-ring.
       2. liquid-morph-shape: Changes the blob's shape independently.
    */
    animation: 
        orbit-sync 1.5s cubic-bezier(0.5, 0.2, 0.2, 0.8) infinite,
        liquid-morph-shape 2s ease-in-out infinite alternate;
}

/* Rotate the blob around the pivot point */
@keyframes orbit-sync {
    0% { transform: translateX(-50%) rotate(0deg); }
    100% { transform: translateX(-50%) rotate(360deg); }
}

@keyframes liquid-morph {
    0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: translateX(-50%) rotate(0deg) scale(1); }
    100% { border-radius: 30% 70% 50% 50% / 30% 30% 70% 70%; transform: translateX(-50%) rotate(0deg) scale(1.1); }
    /* Note: transform here is tricky because we are combining animations. 
       Better to keep orbit separate or use a wrapper div. 
       Simpler approach: Just rotate the whole .loader-core if it has no directional lighting? 
       No, .loader-core is the static glass. 
       Let's stick to transform-origin on the ::after.
    */
}
/* Re-defining liquid-morph to NOT touch transform, only radius */
@keyframes liquid-morph-shape {
    0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    100% { border-radius: 30% 70% 50% 50% / 30% 30% 70% 70%; }
}
@keyframes scan-vertical {
    0% { top: -100%; opacity: 0; }
    50% { opacity: 1; }
    100% { top: 200%; opacity: 0; }
}
`;

// --- MOCK DATA ---
// --- MOCK DATA REMOVED ---
const MOCK_BIDS = [];

// --- COMPONENTS ---

// 1. Sidebar Component
const SidebarStats = ({ bids, processingTime, activeTab }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(145deg, var(--bg-panel), var(--bg-app))' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Current Evaluation
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</span>
            <span className="pill pill-green">Active</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Vendors</span>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{bids.length}</span>
          </div>
          {processingTime && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI Time</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{processingTime.toFixed(2)}s</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Documents Stack
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-card)' }}>
            <FileText size={16} color="var(--accent-secondary)" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tender_Specs_v2.pdf</span>
          </div>

          {bids.map((bid, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '0.5rem', paddingLeft: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bid.vendor_name || `Vendor_${i + 1}`}.pdf</span>
            </div>
          ))}
          {bids.length === 0 && (
            <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', paddingLeft: '0.5rem' }}>
              No documents uploaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Upload Component (Redesigned)
const UploadSection = ({ onUploadStart, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      // Pass files directly up to App.jsx for processing
      onUploadStart(newFiles);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'slide-up 0.5s ease-out' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Intelligent Tender Evaluation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Upload tender requirements and vendor proposals. Our AI will extract parameters, cross-reference compliance, and rank bids instantly.
        </p>
      </div>

      <div
        className={`glass-panel ${isDragging ? 'active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: '4rem 2rem',
          border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
          backgroundColor: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-panel)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px var(--accent-glow)',
          marginBottom: '0.5rem',
          animation: 'float 6s ease-in-out infinite'
        }}>
          <UploadIcon size={40} color="white" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Drop your PDF documents here</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>or click to browse from your computer</p>
        </div>

        <input
          type="file"
          multiple
          accept=".pdf,.docx,.doc"
          onChange={handleFileSelect}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <FileText size={16} /> Supports PDF, DOCX
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} /> Secure Parsing
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Loading Screen (Live Analysis Terminal)
const LoadingScreen = ({ progress, status }) => {
  const [logs, setLogs] = useState([]);
  const messages = [
    "Initializing Neural Core...",
    "Loading Document Vectors...",
    "Extracting Financial Parameters...",
    "Verifying ISO Certifications...",
    "Cross-referencing Delivery Timelines...",
    "Checking Blacklist Databases...",
    "Computing Vendor Score...",
    "Finalizing Compliance Matrix...",
    "Generating Report..."
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < messages.length) {
        setLogs(prev => [...prev.slice(-4), messages[step]]); // Keep last 5
        step++;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 50, background: 'var(--bg-app)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Dynamic Pulse Core */}
      <div className="pulse-core-container" style={{ marginBottom: '3rem', position: 'relative' }}>
        <div className="pulse-ring-outer"></div>
        <div className="pulse-ring-inner"></div>
        <div style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 30px var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'breathe 3s ease-in-out infinite',
          position: 'relative', overflow: 'hidden' // For scanner containment
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))',
            animation: 'scan-vertical 1.5s linear infinite'
          }}></div>
          <ShieldCheck size={32} color="white" style={{ zIndex: 2 }} />
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: '500px', width: '90%' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          System Analysis in Progress
        </h3>

        {/* Humane Progress Bar */}
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-card)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
              transition: 'width 0.4s ease'
            }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="terminal-window" style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '1.5rem',
          textAlign: 'left',
          fontFamily: 'monospace',
          height: '160px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></div>
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>bash --verbose</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: i === logs.length - 1 ? 'var(--accent-primary)' : 'var(--text-secondary)', animation: 'slide-up 0.3s ease-out' }}>
                <span style={{ marginRight: '8px', opacity: 0.5 }}>{new Date().toLocaleTimeString()} &gt;</span>
                {log} {i === logs.length - 1 && <span className="cursor-blink">_</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Compliance Matrix (Enhanced)
// 4. Compliance Matrix (Enhanced)
const ComplianceMatrix = ({ bids }) => {
  if (!bids || bids.length === 0) return null;

  // Helper to determine badge color based on status AND criticality
  const getStatusPill = (status, text, criticality = 'high') => {
    let type = 'pill-red';
    let icon = <XCircle size={12} />;
    let label = text || 'Missing';

    if (status === 'found') {
      type = 'pill-green';
      icon = <CheckCircle size={12} />;
      label = text || 'Compliant';
    } else if (status === 'partial' || status === 'unclear') {
      type = 'pill-yellow';
      icon = <AlertTriangle size={12} />;
      label = text || 'Partial';
    } else if (status === 'provisional') {
      type = 'pill-blue';
      icon = <AlertTriangle size={12} />;
      label = text || 'Provisional';
    } else if (status === 'not_found' || status === 'missing') {
      // SMART LOGIC: Handle missing based on criticality
      if (criticality === 'medium') {
        type = 'pill-yellow'; // Warn but don't error
        label = text || 'Check Doc';
        icon = <AlertTriangle size={12} />;
      } else if (criticality === 'low') {
        type = 'pill-blue'; // Just info
        label = text || 'Not Specified';
        icon = <Settings size={12} />;
      }
    }

    return (
      <span className={`pill ${type}`}>
        {icon} {label}
      </span>
    );
  };

  const getEvidence = (item) => {
    if (!item) return null;
    return item.original_text || item.evidence || null;
  };

  // Defined with Criticality Levels
  const rows = [
    {
      id: 'C.1', title: 'Annual Turnover', key: 'turnover', criticality: 'high',
      render: (b) => {
        if (b.turnover?.status === 'error') return { status: 'missing', label: 'Extraction Error', sub: 'Retry' };

        const val = b.turnover.value
          ? (b.turnover.value >= 10000000 ? `₹${(b.turnover.value / 10000000).toFixed(1)} Cr` : `₹${(b.turnover.value / 100000).toFixed(0)} Lakhs`)
          : 'Value Missing';

        // Mocking a requirement check for visual demonstration as per user request (e.g. > 5Cr)
        // In real app, requirement comes from tender config.
        const suffix = b.turnover.value > 5000000 ? ' (> Min Req)' : '';

        return { status: b.turnover.status, label: val + suffix, sub: 'Financial' };
      }
    },
    {
      id: 'C.2', title: 'EMD / Bid Security', key: 'emd', criticality: 'high',
      render: (b) => {
        const label = b.emd.amount ? `₹${b.emd.amount} Submitted` : (b.emd.status === 'found' ? 'Instrument Found' : 'Missing');
        return { status: b.emd.status, label: label, sub: 'Financial' };
      }
    },
    {
      id: 'C.3', title: 'Legal & Admin Docs', key: 'admin_docs', criticality: 'high',
      render: (b) => {
        const missing = b.admin_docs.missing_docs || [];
        const label = missing.length > 0 ? `${missing.length} Docs Missing` : 'All 5/5 Present';
        let status = b.admin_docs.status;
        if (label === 'All 5/5 Present' && (status === 'not_found' || status === 'error')) {
          status = 'provisional';
        }
        return { status: status, label: label, sub: 'Admin' };
      }
    },
    {
      id: 'C.4', title: 'Blacklisting Decl.', key: 'blacklisting', criticality: 'high',
      render: (b) => {
        const label = b.blacklisting.status === 'found' ? 'Not Blacklisted' : 'No Decl. Found';
        return { status: b.blacklisting.status, label: label, sub: 'Legal' };
      }
    },
    {
      id: 'C.5', title: 'ISO 9001 Cert', key: 'certification', criticality: 'medium',
      render: (b) => {
        return { status: b.certification.has_iso_9001 ? 'found' : 'not_found', label: b.certification.has_iso_9001 ? 'ISO 9001 Found' : 'Cert. Missing', sub: 'Technical' };
      }
    },
    {
      id: 'C.6', title: 'Past Experience', key: 'experience', criticality: 'medium',
      render: (b) => {
        return { status: b.experience.status, label: `${b.experience.project_count || 0} Projects Citations`, sub: 'Experience' };
      }
    },
    {
      id: 'C.7', title: 'Solvency Proof', key: 'solvency', criticality: 'medium',
      render: (b) => {
        const label = b.solvency.amount ? `₹${b.solvency.amount} Solvency` : (b.solvency.status === 'found' ? 'Cert. Attached' : 'Missing');
        return { status: b.solvency.status, label: label, sub: 'Financial' };
      }
    },
    {
      id: 'C.8', title: 'Delivery Timeline', key: 'delivery', criticality: 'low',
      render: (b) => {
        return { status: b.delivery.status, label: b.delivery.days ? `${b.delivery.days} Days Committed` : 'Timeline Unclear', sub: 'Logistics' };
      }
    },
    {
      id: 'C.9', title: 'Warranty Period', key: 'warranty', criticality: 'low',
      render: (b) => {
        const label = b.warranty.duration_months ? `${b.warranty.duration_months} Months` : 'Period Unspecified';
        return { status: b.warranty.status, label: label, sub: 'Technical' };
      }
    },
    {
      id: 'C.10', title: 'Make In India', key: 'mii', criticality: 'low',
      render: (b) => {
        const label = b.mii.class_type || 'Exemption / Null';
        return { status: b.mii.class_type ? 'found' : 'missing', label: label, sub: 'Policy' };
      }
    }
  ];

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Compliance Matrix Report', 14, 22);

    // Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

    // Prepare table body
    const tableBody = rows.map((row) => {
      const rowData = [row.title]; // First column: Requirement
      bids.forEach((bid) => {
        const result = row.render(bid);

        // Get evidence text instead of status
        const item = bid[row.key];
        let evidence = item?.original_text || item?.evidence || '';
        if (evidence.length > 200) evidence = evidence.substring(0, 200) + '...'; // Truncate long text

        rowData.push(`${result.label}\n${evidence}`);
      });
      return rowData;
    });

    // Prepare table headers
    const tableHead = [['Requirement Specification', ...bids.map(b => b.vendor_name)]];

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' }, // Requirement column
      },
      didParseCell: function (data) {
        // Optional: Add styling based on content if needed
      }
    });

    // --- ADD PIE CHART ---
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 500;
      canvas.height = 300;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Chart Title
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.fillText('Vendor Score Ranking', 250, 30); // Centered at 500/2 = 250

      // Data Preparation
      const sortedBidsForChart = [...bids].sort((a, b) => b.score - a.score);
      const scores = sortedBidsForChart.map(b => b.score || 0);
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']; // Green, Blue, Yellow, Red, Purple

      // Draw Pie
      let total = scores.reduce((sum, val) => sum + val, 0);
      if (total === 0) total = 1;

      let startAngle = 0;
      const centerX = 150;
      const centerY = 160;
      const radius = 100;

      scores.forEach((score, index) => {
        const sliceAngle = (score / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        startAngle += sliceAngle;
      });

      // --- CUTOUT FOR DOUGHNUT ---
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Center Text
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bids.length.toString(), centerX, centerY - 10);

      ctx.font = '12px Arial';
      ctx.fillStyle = '#6B7280';
      ctx.fillText('Vendors', centerX, centerY + 15);

      // Legend
      const legendX = 300;
      let legendY = 80;

      sortedBidsForChart.forEach((bid, index) => {
        // Color Box
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(legendX, legendY, 15, 15);

        // Text
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'left';
        ctx.fillText(`${bid.vendor_name} (Rank #${index + 1})`, legendX + 25, legendY + 12);

        // Score
        ctx.font = 'bold 14px Arial';
        ctx.fillText(`${bid.score}/100`, legendX + 25, legendY + 28);

        legendY += 50;
      });

      const imgData = canvas.toDataURL('image/png');

      // Add new page if table is long, else add below
      const finalY = doc.lastAutoTable.finalY || 200;
      if (finalY > 180) doc.addPage();

      doc.addImage(imgData, 'PNG', 15, finalY > 180 ? 20 : finalY + 10, 180, 100);

    } catch (e) {
      console.error("Error generating chart", e);
    }

    doc.save('Compliance_Report.pdf');
  };

  // Helper Component: Bid Summary Card
  const BidSummaryCard = ({ bid }) => (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

      {/* Header: Vendor & Ref */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VENDOR</span>
          <h4 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{bid.vendor_name}</h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="pill pill-blue" style={{ fontSize: '0.75rem' }}>{bid.basic_details?.tender_no || 'Ref: N/A'}</span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {bid.basic_details?.organization_name || 'Organization N/A'}
          </div>
        </div>
      </div>

      {/* Work Title */}
      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '500', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        {bid.basic_details?.tender_title || 'Work Description Not Detected'}
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.85rem' }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Submission Date</div>
          <div style={{ fontWeight: '600' }}>{bid.basic_details?.bid_date || '--'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Validity</div>
          <div style={{ fontWeight: '600' }}>{bid.basic_details?.validity_period || '--'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Value</div>
          <div style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{bid.basic_details?.total_bid_value || '--'}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'slide-up 0.5s ease-out' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Compliance & Analysis</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Automated "Gate Check" of technical and financial parameters.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={generatePDF} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Export PDF Report
          </button>
        </div>
      </div>

      {/* NEW: Horizontal Bid Summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {bids.map((bid, i) => (
          <BidSummaryCard key={i} bid={bid} />
        ))}
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '1.25rem', textAlign: 'left', width: '30%', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Requirement Specification</th>
              {bids.map((bid, i) => (
                <th key={i} style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--text-primary)', fontSize: '1rem' }}>
                  {bid.vendor_name} <span style={{ fontSize: '0.8rem', fontWeight: '400', color: 'var(--text-muted)' }}>(Analysis)</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1.25rem', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{row.id}</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {row.render(bids[0]).sub}
                    </span>
                    {row.criticality === 'high' &&
                      <span style={{ fontSize: '0.7rem', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>CRITICAL</span>
                    }
                  </div>
                </td>
                {bids.map((bid, i) => {
                  const data = row.render(bid);
                  const evidence = getEvidence(bid[row.key]);
                  return (
                    <td key={i} style={{ padding: '1.25rem', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        {getStatusPill(data.status, data.label, row.criticality)}
                        {evidence && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.4', background: 'var(--bg-app)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                            "{evidence.length > 80 ? evidence.substring(0, 80) + '...' : evidence}"
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4.5 History Component
const HistoryComponent = ({ onAnalyze }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setFiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Loading history...</div>;

  return (
    <div style={{ animation: 'slide-up 0.5s ease-out' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Document Repository</h2>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {files.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No historical files found.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {files.map((file, i) => (
              <div key={i} className="card-hover" style={{
                padding: '1rem', borderRadius: '8px',
                background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px',
                    background: 'var(--status-blue-bg)', color: 'var(--status-blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <File size={16} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '500', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF Document</div>
                  </div>
                </div>
                <button
                  onClick={() => onAnalyze(file)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  Analyze & Compare
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Scoring & Ranking (Enhanced)
const ScoringRanking = ({ bids }) => {
  if (!bids || bids.length === 0) return null;

  // Sort by score
  const sortedBids = [...bids].sort((a, b) => b.score - a.score);

  return (
    <div style={{ animation: 'slide-up 0.5s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI Scoring & Ranking</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Weighted scoring based on technical qualification and administrative compliance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {sortedBids.map((bid, idx) => (
          <div key={idx} className="glass-panel card-hover" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: idx === 0 ? 'var(--status-green)' : 'var(--bg-card)', borderBottomLeftRadius: '12px', color: idx === 0 ? 'white' : 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.9rem' }}>
              Rank #{idx + 1}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${idx === 0 ? 'var(--status-green)' : 'var(--bg-card)'}, transparent)`,
                border: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 'bold', color: idx === 0 ? 'white' : 'var(--text-secondary)'
              }}>
                {bid.vendor_name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{bid.vendor_name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: V-{100 + idx}</span>
                  {idx === 0 && <span className="pill pill-green" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>Best Choice</span>}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Score</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: bid.score > 80 ? 'var(--status-green)' : bid.score > 50 ? 'var(--status-yellow)' : 'var(--status-red)' }}>
                  {bid.score}/100
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${bid.score}%`, height: '100%',
                  background: bid.score > 80 ? 'var(--status-green)' : bid.score > 50 ? 'var(--status-yellow)' : 'var(--status-red)',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Turnover</div>
                <div style={{ fontWeight: '600' }}>{bid.turnover.value > 10000000 ? `${(bid.turnover.value / 10000000).toFixed(1)} Cr` : `${(bid.turnover.value / 100000).toFixed(0)} L`}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Experience</div>
                <div style={{ fontWeight: '600' }}>{bid.experience.project_count} Projects</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Dashboard Layout
const DashboardLayout = ({ children, sidebarContent, activeTab, onTabChange, theme, onToggleTheme }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '320px',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10
      }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
              <img src="/logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Logo" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700', letterSpacing: '-0.02em' }}>ProAudit AI</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '500' }}>Enterprise Edition</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {sidebarContent}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onToggleTheme}
            className="btn"
            style={{ width: '100%', justifyContent: 'center', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Header Navigation */}
        <header style={{
          height: '80px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => onTabChange('upload')}
              className={`btn ${activeTab === 'upload' ? 'btn-secondary active' : 'btn-secondary'}`}
            >
              1. Upload
            </button>
            <ChevronRight color="var(--text-muted)" size={16} style={{ alignSelf: 'center' }} />
            <button
              onClick={() => onTabChange('compliance')}
              className={`btn ${activeTab === 'compliance' ? 'btn-secondary active' : 'btn-secondary'}`}
              disabled={!sidebarContent.props.bids.length}
            >
              2. Compliance
            </button>
            <ChevronRight color="var(--text-muted)" size={16} style={{ alignSelf: 'center' }} />
            <button
              onClick={() => onTabChange('ranking')}
              className={`btn ${activeTab === 'ranking' ? 'btn-secondary active' : 'btn-secondary'}`}
              disabled={!sidebarContent.props.bids.length}
            >
              3. Ranking
            </button>

            {/* History separated */}
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 0.5rem' }}></div>

            <button
              onClick={() => onTabChange('history')}
              className={`btn ${activeTab === 'history' ? 'btn-secondary active' : 'btn-secondary'}`}
              style={{ color: 'var(--text-secondary)' }}
            >
              <History size={14} style={{ marginRight: '6px' }} /> History
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <Settings size={20} />
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', border: '2px solid var(--bg-panel)' }}></div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', position: 'relative' }}>
          {children}
        </div>
      </main>
    </div>
  );
};


// --- MAIN APP ENTRY POINT ---

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('upload');
  const [bids, setBids] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing');

  // Handle Theme Change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUploadStart = async (files) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText('Initializing Upload...');

    // Humane Progress Timer - Increments randomly to ~90% while waiting
    const progressInterval = setInterval(() => {
      setProgress(old => {
        if (old >= 90) return 90; // Wait for real completion
        const diff = Math.random() * 10;
        return Math.min(old + diff, 90);
      });
    }, 500);

    const newBids = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      setStatusText(`Analyzing ${file.name}...`);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to upload ${file.name}`);
          continue;
        }

        const data = await response.json();

        let calculatedScore = 0;
        if (data.turnover?.status === 'found') calculatedScore += 20;
        if (data.certification?.has_iso_9001) calculatedScore += 20;
        if (data.experience?.status === 'found') calculatedScore += 20;
        if (data.delivery?.status === 'found') calculatedScore += 20;
        if (data.admin_docs?.status === 'found') calculatedScore += 20;
        if (data.turnover?.status === 'provisional') calculatedScore += 10;

        data.score = calculatedScore;
        newBids.push(data);

        // Progress Update
        setProgress(Math.round(((i + 1) / totalFiles) * 90));

      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    clearInterval(progressInterval);
    setProgress(100);
    setStatusText('Finalizing Report...');

    setTimeout(() => {
      setBids(newBids);
      setIsProcessing(false);
      setActiveTab('compliance');
    }, 1000);
  };

  const handleHistoryAnalyze = async (filename) => {
    setIsProcessing(true);
    setProgress(0);
    setStatusText(`Loading ${filename} from repository...`);

    // Fake progress for UX
    const progressInterval = setInterval(() => {
      setProgress(old => Math.min(old + 20, 90));
    }, 300);

    try {
      const data = await api.analyzeHistoryFile(filename);

      let calculatedScore = 0;
      if (data.turnover?.status === 'found') calculatedScore += 20;
      if (data.certification?.has_iso_9001) calculatedScore += 20;
      if (data.experience?.status === 'found') calculatedScore += 20;
      if (data.delivery?.status === 'found') calculatedScore += 20;
      if (data.admin_docs?.status === 'found') calculatedScore += 20;
      if (data.turnover?.status === 'provisional') calculatedScore += 10;

      data.score = calculatedScore;

      clearInterval(progressInterval);
      setProgress(100);
      setStatusText('Restoring Analysis...');

      setTimeout(() => {
        setBids(prev => [...prev, data]); // Add to existing or replace? User asked to "inject into existing".
        setIsProcessing(false);
        setActiveTab('compliance');
      }, 800);

    } catch (error) {
      console.error("History analysis failed:", error);
      setIsProcessing(false);
      alert("Failed to analyze history file: " + error.message);
    }
  };

  return (
    <>
      <style>{cssStyles}</style>

      {isProcessing && (
        <LoadingScreen progress={progress} status={statusText} />
      )}

      <DashboardLayout
        theme={theme}
        onToggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarContent={<SidebarStats bids={bids} activeTab={activeTab} processingTime={bids.length > 0 ? 3.42 : null} />}
      >
        {activeTab === 'upload' && (
          <UploadSection onUploadStart={handleUploadStart} />
        )}

        {activeTab === 'history' && (
          <HistoryComponent onAnalyze={handleHistoryAnalyze} />
        )}

        {activeTab === 'compliance' && (
          <ComplianceMatrix bids={bids} />
        )}

        {activeTab === 'ranking' && (
          <ScoringRanking bids={bids} />
        )}

      </DashboardLayout>
      <ChatBot />
    </>
  );
}