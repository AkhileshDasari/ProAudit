import React, { useState } from 'react';

const Upload = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Upload files sequentially for MVP simplicity
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = await response.json();
        onUploadSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-container">
            <div className="scan-line"></div>
        </div>
        <h3 style={{ marginTop: '2rem', animation: 'pulse 1.5s infinite' }}>Analyzing Bid Documents...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Extracting 10+ Compliance Parameters via Gemini AI</p>
      </div>
    );
  }

  return (
    <div className="card upload-zone" style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-color)', transition: 'all 0.3s ease' }}>
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className="btn btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', fontSize: '1.1rem' }}>
        Upload Bid PDFs
      </label>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
        Drag & drop or click to select files
      </p>
      {error && <p style={{ color: 'var(--status-red)', marginTop: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '6px' }}>{error}</p>}
    </div>
  );
};

export default Upload;
