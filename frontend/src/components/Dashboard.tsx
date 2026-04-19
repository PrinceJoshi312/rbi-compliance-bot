import React from 'react';
import { 
  UserCheck, 
  ShieldAlert, 
  ClipboardCheck, 
  FileText, 
  AlertTriangle, 
  Building2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const categories = [
    { id: 'kyc', name: 'KYC', description: 'Know Your Customer', icon: UserCheck },
    { id: 'aml', name: 'AML', description: 'Anti-Money Laundering', icon: ShieldAlert },
    { id: 'audit', name: 'Audit Reports', description: 'Internal & External Audits', icon: ClipboardCheck },
    { id: 'circulars', name: 'RBI Circulars', description: 'Latest Regulatory Updates', icon: FileText },
    { id: 'risk', name: 'Risk Assessment', description: 'Compliance Risk Analysis', icon: AlertTriangle },
    { id: 'filings', name: 'Regulatory Filings', description: 'Mandatory RBI Submissions', icon: Building2 },
  ];

  const stats = [
    { label: 'Total Documents', value: '124', trend: '+12%', trendType: 'up' },
    { label: 'Compliance Score', value: '98.2%', trend: '+0.5%', trendType: 'up' },
    { label: 'Upcoming Deadlines', value: '5', trend: 'Next 7 days', trendType: 'none' },
  ];

  return (
    <div className="dashboard-view">
      <div className="view-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Compliance Overview</h2>
            <p>Monitor and manage your RBI regulatory compliance status.</p>
          </div>
          <a 
            href="https://rbi.org.in/Scripts/BS_ViewMasterCirculardetails.aspx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            RBI Master Circulars
          </a>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            {stat.trendType !== 'none' && (
              <span className={`stat-trend ${stat.trendType === 'up' ? 'trend-up' : 'trend-down'}`}>
                {stat.trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend} from last month
              </span>
            )}
            {stat.trendType === 'none' && (
              <span className="stat-trend" style={{ color: 'var(--slate-500)' }}>
                {stat.trend}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="categories-section">
        <h3 style={{ marginBottom: '20px' }}>Compliance Categories</h3>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-icon">
                <cat.icon size={24} />
              </div>
              <div className="category-info">
                <h4>{cat.name}</h4>
                <p>{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
