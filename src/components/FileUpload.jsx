import React from 'react';

function FileUpload({ label, accept = ".pdf", multiple = false, onChange, selectedFiles }) {
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'block', marginBottom: '0.5rem' }}
      />
      {selectedFiles && (
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          {multiple ? (
            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
              {Array.from(selectedFiles).map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>
          ) : (
            <div>Selected: {selectedFiles[0]?.name}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
