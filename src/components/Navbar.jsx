import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('userEmail');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavigate = (id) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <header className={`navbar-header ${scrolled ? 'solid' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>ParentUp</Link>

        {/* Desktop menu */}
        <nav className="desktop-menu">
          <button className="menu-item" onClick={() => handleNavigate('neonato')}>Cura del bambino</button>
          <button className="menu-item" onClick={() => handleNavigate('benessere')}>Benessere</button>
          <button className="menu-item" onClick={() => handleNavigate('lgbtq')}>Genitorialità LGBTQ+</button>
          <button className="menu-item" onClick={() => handleNavigate('lavoro')}>Ritorno al lavoro</button>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="menu-item">Dashboard</Link>
              <button className="menu-item logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-item">Login</Link>
              <Link to="/register" className="menu-item">Registrati</Link>
            </>
          )}
        </nav>

        {/* Hamburger per mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        > 
          <div className="hamburger-lines" />
        </button>
      </div>

      {/* Dropdown solo mobile */}
      {menuOpen && (
        <div className="dropdown-menu">
          <button className="menu-item" onClick={() => handleNavigate('neonato')}>Cura del bambino</button>
          <button className="menu-item" onClick={() => handleNavigate('benessere')}>Benessere</button>
          <button className="menu-item" onClick={() => handleNavigate('lgbtq')}>Genitorialità LGBTQ+</button>
          <button className="menu-item" onClick={() => handleNavigate('lavoro')}>Ritorno al lavoro</button>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="menu-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="menu-item logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-item" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="menu-item" onClick={() => setMenuOpen(false)}>Registrati</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
