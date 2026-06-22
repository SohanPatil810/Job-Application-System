import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">HireHub</Link>
      <div className="nav-links">
        {!user ? (
          <Link to="/login" className="btn btn-primary">Login</Link>
        ) : (
          <>
            <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Hello, {user.email}</span>
            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
