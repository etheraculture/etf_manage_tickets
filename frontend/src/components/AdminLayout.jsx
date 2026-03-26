import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, School, ScanLine, ClipboardList, LogOut, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/scuole', label: 'Scuole', icon: School },
  { to: '/admin/studenti', label: 'Studenti', icon: Users },
  { to: '/admin/scansioni', label: 'Scansioni', icon: ClipboardList },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('ethera_admin_token');
    navigate('/admin');
  }

  return (
    <div className="admin-layout">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">ETHERA FUTURE TALKS</div>
          <div className="sidebar-sub">Pannello Admin</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
          {/* Il pulsante Check-in su Desktop è nella sidebar ma nascosto su mobile */}
          <NavLink
            to="/admin/checkin"
            className={({ isActive }) =>
              `nav-item sidebar-link desktop-only-link ${isActive ? 'active' : ''}`
            }
          >
            <ScanLine size={20} />
            Check-in Scanner
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {children}
      </main>

      {/* Mobile Nav Footer */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={24} />
          <span>Dash</span>
        </NavLink>
        <NavLink to="/admin/studenti" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={24} />
          <span>List</span>
        </NavLink>

        <div className="mobile-nav-fab-container">
          <NavLink to="/admin/checkin" className="mobile-nav-fab">
            <ScanLine size={32} />
          </NavLink>
        </div>

        <NavLink to="/admin/scuole" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
          <School size={24} />
          <span>Scuole</span>
        </NavLink>
        <button onClick={handleLogout} className="mobile-nav-item text-error">
          <LogOut size={24} />
          <span>Esci</span>
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
