import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileBarChart, 
  History, 
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isMenuOpen, setIsMenuOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Compliance', icon: UploadCloud },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'logs', label: 'Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`sidebar ${isMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} color="white" />
          <h1>RBI Compliance</h1>
        </div>
        <button className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
          <X size={24} color="white" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '24px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
        RBI Bot v2.0 &copy; 2026
      </div>
    </aside>
  );
};

export default Sidebar;
