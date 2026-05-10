import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { api } from '../api/api';

function UploadPage({ onEvaluateComplete }) {
  const [tenderFile, setTenderFile] = useState(null);
  const [vendorFiles, setVendorFiles] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRunEvaluation = async () => {
    if (!tenderFile || !vendorFiles) {
      setError('Please upload both a tender document and vendor documents.');
      return;
    }

    setLoading(true);
    setStatus('Uploading tender document...');
    setError('');

    try {
      // 1. Upload Tender
      await api.uploadTender(tenderFile[0]);
      
      // 2. Upload Vendors
      setStatus('Uploading vendor documents...');
      await api.uploadVendors(vendorFiles);
      
      // 3. Run Evaluation
      setStatus('Running AI Evaluation (this may take a moment)...');
      await api.evaluate();
      
      setStatus('Evaluation Complete!');
      onEvaluateComplete();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload & Evaluate</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Upload the tender requirement PDF and vendor proposal PDFs to start the compliance check.
      </p>

      <div className="card">
        <FileUpload 
          label="1. Tender Document (PDF)" 
          onChange={setTenderFile} 
          selectedFiles={tenderFile}
        />
        
        <FileUpload 
          label="2. Vendor Proposals (PDFs)" 
          multiple={true} 
          onChange={setVendorFiles} 
          selectedFiles={vendorFiles}
        />

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}

        {status && (
          <div style={{ color: '#2563eb', marginBottom: '1rem' }}>
            {status}
          </div>
        )}

        <button 
          className="btn" 
          onClick={handleRunEvaluation}
          disabled={loading}
          style={{ width: '100%', padding: '1rem' }}
        >
          {loading ? 'Processing...' : 'Run Compliance Evaluation'}
        </button>
      </div>
    </div>
  );
}

export default UploadPage;
