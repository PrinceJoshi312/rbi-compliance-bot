import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileText,
  X
} from 'lucide-react';

interface UploadComplianceProps {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
  isUploaded: boolean;
}

const UploadCompliance: React.FC<UploadComplianceProps> = ({ onUpload, isUploading, isUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedExtensions = ['.pdf', '.docx', '.xlsx'];

  const validateFiles = (files: File[]) => {
    for (const file of files) {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(extension)) {
        return `Invalid document. Please upload RBI compliance-related files only (${allowedExtensions.join(', ')}).`;
      }
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const validationError = validateFiles(files);
    
    if (validationError) {
      setError(validationError);
      setSelectedFiles([]);
    } else {
      setError(null);
      setSelectedFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files);
    const validationError = validateFiles(files);
    
    if (validationError) {
      setError(validationError);
      setSelectedFiles([]);
    } else {
      setError(null);
      setSelectedFiles(files);
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0 || !docType) return;
    await onUpload(selectedFiles);
    if (!isUploading) {
        setSelectedFiles([]);
        setDocType('');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-view">
      <div className="view-header">
        <h2>Upload Compliance Documents</h2>
        <p>Submit your documents for automated compliance verification.</p>
      </div>

      <div className="upload-container">
        <div className="info-box">
          <Info className="info-box-icon" size={20} />
          <div className="info-box-content">
            <h5>RBI Compliance Guidelines</h5>
            <p>Ensure documents are clear and represent recent regulatory filings or circulars. Supported formats include PDF, DOCX, and XLSX.</p>
          </div>
        </div>

        <div 
          className="upload-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="upload-icon" size={48} />
          <div className="upload-instructions">
            <h3>Upload RBI compliance documents only</h3>
            <p>Drag and drop files here or click to browse</p>
          </div>
          <div className="file-types">
            Supported formats: PDF, DOCX, XLSX
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept={allowedExtensions.join(',')}
            style={{ display: 'none' }}
          />
        </div>

        {error && (
          <div className="validation-message error" style={{ marginTop: '16px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="upload-form">
            <div className="form-group">
              <label>Select Document Category</label>
              <select 
                className="form-select" 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                required
              >
                <option value="">-- Choose Category --</option>
                <option value="kyc">KYC (Know Your Customer)</option>
                <option value="aml">AML (Anti-Money Laundering)</option>
                <option value="audit">Audit Reports</option>
                <option value="circulars">RBI Circulars</option>
                <option value="risk">Risk Assessment</option>
                <option value="filings">Regulatory Filings</option>
              </select>
            </div>

            <div className="selected-files">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Files to upload:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedFiles.map((file, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: '4px',
                    border: '1px solid var(--slate-200)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color="var(--slate-500)" />
                      <span style={{ fontSize: '0.875rem' }}>{file.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        style={{ background: 'none', border: 'none', color: 'var(--slate-400)' }}
                    >
                        <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-primary"
              disabled={isUploading || !docType}
              onClick={handleUploadSubmit}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isUploading ? <Loader2 className="spin" size={18} /> : null}
              {isUploading ? 'Uploading & Processing...' : 'Start Verification'}
            </button>
          </div>
        )}

        {isUploaded && !isUploading && selectedFiles.length === 0 && (
          <div className="validation-message success" style={{ marginTop: '16px' }}>
            <CheckCircle2 size={18} />
            <span>Documents uploaded and processed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCompliance;
