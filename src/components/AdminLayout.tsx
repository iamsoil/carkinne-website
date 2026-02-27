import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const navItems = [
  { label: 'Dashboard',   path: '/admin' },
  { label: 'Cars',        path: '/admin/cars' },
  { label: 'Add New Car', path: '/admin/cars/new' },
  { label: 'Blog Posts',  path: '/admin/blog' },
  { label: 'Showrooms',   path: '/admin/showrooms' },
  { label: 'Offers',      path: '/admin/offers' },
  { label: 'Announcement', path: '/admin/announcement' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR — always visible */}
      <div style={{
        width: 240, background: '#fff',
        borderRight: '1px solid #d2d2d7',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', 
          borderBottom: '1px solid #d2d2d7' }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>
            <span style={{ color: '#1d1d1f' }}>Car</span>
            <span style={{ color: '#e8531a' }}>Kinne</span>
          </span>
          <p style={{ fontSize: 12, color: '#6e6e73', 
            marginTop: 2 }}>Admin Panel</p>
        </div>

        {/* Nav Items */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 10,
                marginBottom: 4,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                background: location.pathname === item.path 
                  ? '#fff8f5' : 'transparent',
                color: location.pathname === item.path 
                  ? '#e8531a' : '#6e6e73',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '16px 12px',
          borderTop: '1px solid #d2d2d7' }}>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%', padding: '10px 12px',
              borderRadius: 10, border: 'none',
              background: 'transparent', cursor: 'pointer',
              fontSize: 14, color: '#6e6e73',
              textAlign: 'left',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT — offset by sidebar width */}
      <div style={{ 
        marginLeft: 240, flex: 1,
        background: '#f5f5f7', minHeight: '100vh',
        padding: '32px',
      }}>
        {children}
      </div>
    </div>
  );
}