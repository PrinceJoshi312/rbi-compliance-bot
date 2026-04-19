import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <div className="topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={24} color="var(--slate-600)" />
        </button>
        {/* Search bar removed as requested */}
      </div>

      <div className="topbar-actions">
        {/* Actions removed previously: Bell and Profile */}
      </div>
    </div>
  );
};

export default TopBar;
