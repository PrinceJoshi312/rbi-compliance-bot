import React from 'react';
import { FileText, MoreVertical, ExternalLink } from 'lucide-react';

const DocumentStatus: React.FC = () => {
  const documents = [
    { id: 1, name: 'KYC_Verification_Q1.pdf', type: 'KYC', date: 'Apr 18, 2026', status: 'verified' },
    { id: 2, name: 'AML_Compliance_Policy.docx', type: 'AML', date: 'Apr 15, 2026', status: 'verified' },
    { id: 3, name: 'Internal_Audit_v2.pdf', type: 'Audit Reports', date: 'Apr 10, 2026', status: 'pending' },
    { id: 4, name: 'RBI_Circular_772.pdf', type: 'RBI Circulars', date: 'Apr 05, 2026', status: 'verified' },
    { id: 5, name: 'Risk_Assessment_Draft.xlsx', type: 'Risk Assessment', date: 'Mar 28, 2026', status: 'rejected' },
  ];

  return (
    <div className="status-view">
      <div className="view-header">
        <h2>Document Status Tracking</h2>
        <p>View and track the verification status of all compliance documents.</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Category</th>
              <th>Date Uploaded</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color="var(--slate-400)" />
                    <span style={{ fontWeight: 500 }}>{doc.name}</span>
                  </div>
                </td>
                <td>{doc.type}</td>
                <td>{doc.date}</td>
                <td>
                  <span className={`status-tag ${doc.status}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentStatus;
