import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('userEmail');

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNavbar = () => {
    const navbar = document.getElementById('navbarNav');
    if (navbar && navbar.classList.contains('show')) {
      const existingInstance = Collapse.getInstance(navbar);
      if (existingInstance) {
        existingInstance.hide();
      } else {
        const bsCollapse = new Collapse(navbar, { toggle: false });
        bsCollapse.hide();
      }
    }
  };

  const handleScrollOrNavigate = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      closeNavbar();
    }, 100);

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');
      if (navbar?.classList.contains('show') && !navbar.contains(event.target) && !toggler.contains(event.target)) {
        closeNavbar();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top px-3 shadow-sm ${scrolled ? 'navbar-solid' : 'navbar-transparent'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeNavbar}>
          ParentUp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleScrollOrNavigate('neonato')}>
                Cura del bambino
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleScrollOrNavigate('benessere')}>
                Benessere
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleScrollOrNavigate('lgbtq')}>
                Genitorialità LGBTQ+
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleScrollOrNavigate('lavoro')}>
                Ritorno al lavoro
              </button>
            </li>
          </ul>

          <ul className="navbar-nav">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={closeNavbar}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-2" onClick={() => {
                    localStorage.clear();
                    navigate('/login');
                    closeNavbar();
                  }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeNavbar}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeNavbar}>
                    Registrati
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
