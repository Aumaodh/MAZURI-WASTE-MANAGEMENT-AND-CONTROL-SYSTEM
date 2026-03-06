import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        <h1 style={styles.logo}>🌱 Mazuri Waste Management</h1>
        {user ? (
          <div style={styles.navRight}>
            <span style={styles.userInfo}>{user.name}</span>
            <Link to="/" style={styles.navLink}>Dashboard</Link>
            <Link to="/waste" style={styles.navLink}>Waste</Link>
            <Link to="/collections" style={styles.navLink}>Collections</Link>
            <Link to="/reports" style={styles.navLink}>Reports</Link>
            {user.role === 'admin' && <Link to="/users" style={styles.navLink}>Users</Link>}
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={styles.navLink}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 0',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    margin: 0,
    fontSize: '20px'
  },
  navRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none'
  },
  userInfo: {
    fontSize: '14px'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navbar;
