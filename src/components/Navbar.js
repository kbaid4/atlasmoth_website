import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MusicToggle from './home/MusicToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Change navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-surface py-2 shadow-lg' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/Logo.png" alt="AtlasMoth logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 mx-auto justify-center">
          <NavLink
            to="/"
            active={location.pathname === "/" && (!location.hash || location.hash === "#hero")}
            idTarget="hero"
            onClick={() => { window.location.hash = ""; }}
          >
            Home
          </NavLink>
          <NavLink
            to="/#services"
            active={location.hash === "#services"}
            idTarget="services"
          >
            Services
          </NavLink>
          <NavLink
            to="/#how-we-work"
            active={location.hash === "#how-we-work"}
            idTarget="how-we-work"
          >
            How We Work
          </NavLink>
          <NavLink to="/blog" active={location.pathname === "/blog"}>
            Blog
          </NavLink>
          <NavLink
            to="/#contact"
            active={location.hash === "#contact"}
            idTarget="contact"
          >
            Contact
          </NavLink>
        </div>

        {/* Desktop CTA Button and Sound Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="https://cal.com/kushagrabaid/30-minute-meeting"
              className="game-button font-display font-bold text-xs px-4 py-2 rounded-full border shadow-[0_0_12px_2px_#9D1F15]"
              style={{ backgroundColor: '#FBF7BA', color: '#9D1F15', borderColor: '#9D1F15' }}
            >
              BOOK A CALL
            </a>
          </motion.div>
          <div className="flex items-center">
            <MusicToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className={`text-white bg-surface/70 border border-white/20 shadow-lg rounded-lg p-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 ${menuOpen ? 'ring-2 ring-primary' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            tabIndex={0}
            style={{ WebkitTapHighlightColor: 'rgba(0,0,0,0.1)' }}
            onClick={() => setMenuOpen((open) => !open)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(open => !open); }}
          >
            {menuOpen ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="5" width="18" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
                <rect x="3" y="17" width="18" height="2" rx="1" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col md:hidden"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="ml-auto w-4/5 max-w-xs h-full bg-surface shadow-2xl flex flex-col p-8 gap-6"
            id="mobile-menu"
          >
            <nav className="flex flex-col gap-4 mt-10">
              {[{ to: '/', label: 'Home', active: location.pathname === '/' },
              { to: '/#services', label: 'Services', active: location.hash === '#services' },
              { to: '/#how-we-work', label: 'How We Work', active: location.hash === '#how-we-work' },
              { to: '/blog', label: 'Blog', active: location.pathname === '/blog' },
              { to: '/#contact', label: 'Contact', active: location.hash === '#contact' },
              ].map(link => (
                <div className="relative" key={link.label}>
                  <NavLink
                    to={link.to}
                    active={link.active}
                    onClick={() => setMenuOpen(false)}
                    idTarget={link.to.startsWith('/#') ? link.to.replace('/#','') : undefined}
                  >
                    {link.label}
                  </NavLink>
                </div>
              ))}
            </nav>
            <a
              href="https://cal.com/kushagrabaid/30-minute-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="game-button font-display font-bold text-base px-6 py-3 rounded-full animate-glow mt-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ minHeight: 48, backgroundColor: '#FBF7BA', color: '#9D1F15' }}
              onClick={() => setMenuOpen(false)}
              tabIndex={0}
            >
              BOOK A CALL
            </a>
            
            {/* Music Toggle in Mobile Menu */}
            <div className="mt-4 flex justify-center">
              <MusicToggle />
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-3 mt-6 items-center justify-center">
              {/* Email */}
              <a href="mailto:kbaid@atlasmoth.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><path d="M4 7l8 6 8-6" stroke="#9D1F15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              {/* Newsletter */}
              <a href="https://www.atlasmothnewsletter.com/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="Newsletter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2" fill="#FFC233" stroke="#9D1F15" strokeWidth="2"/><path d="M4 7l8 6 8-6" stroke="#9D1F15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" fill="#ff6b99"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/atlasmothdesign/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="#ff6b99"/><circle cx="17.5" cy="6.5" r="1.5" fill="#9D1F15"/></svg>
              </a>
              {/* Twitter */}
              <a href="https://x.com/atlasmothdesign" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="6" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><path d="M8 15c6 0 9-5 9-9v-.5A6.5 6.5 0 0 0 20 3a6.5 6.5 0 0 1-2.36.65A3.28 3.28 0 0 0 19.5 2a6.5 6.5 0 0 1-2.07.79A3.28 3.28 0 0 0 12 5.5c0 .26.03.52.09.77C8.09 6.09 4.54 4.13 2.5 1.5c-.36.6-.57 1.3-.57 2.05 0 1.41.72 2.66 1.81 3.39A3.23 3.23 0 0 1 2 6.1v.04c0 1.97 1.4 3.62 3.26 4-.34.09-.7.14-1.07.14-.26 0-.51-.03-.76-.07.51 1.6 2 2.77 3.76 2.8A6.57 6.57 0 0 1 2 18.58 9.29 9.29 0 0 0 8 20c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.36 8.36 0 0 0 22 3.5c-.66.29-1.36.48-2.1.56A3.28 3.28 0 0 0 20 3z" fill="#9D1F15"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@atlasmothdesign" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="6" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><path d="M14.5 7V17a4.5 4.5 0 1 1-3-4.24V7h3.5z" fill="#ff6b99"/><circle cx="17.5" cy="7.5" r="1.5" fill="#9D1F15"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/atlasmoth" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><rect x="6" y="10" width="2.5" height="7" fill="#9D1F15"/><rect x="15.5" y="13" width="2.5" height="4" fill="#9D1F15"/><circle cx="7.25" cy="7.25" r="1.25" fill="#ff6b99"/><rect x="10" y="10" width="2.5" height="7" fill="#9D1F15"/></svg>
              </a>
              {/* Threads */}
              <a href="https://www.threads.com/@atlasmothdesign" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center bg-surface hover:bg-primary transition-colors duration-300" aria-label="Threads">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="6" fill="#FBF7BA" stroke="#9D1F15" strokeWidth="2"/><path d="M12 7c2.5 0 4.5 1.5 4.5 4.5S14.5 16 12 16s-4.5-1.5-4.5-4.5S9.5 7 12 7z" stroke="#9D1F15" strokeWidth="2"/><path d="M12 10.5c.83 0 1.5.67 1.5 1.5S12.83 13.5 12 13.5 10.5 12.83 10.5 12s.67-1.5 1.5-1.5z" fill="#ff6b99"/></svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

// NavLink component with active state styling

const NavLink = ({ children, to, active, idTarget, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={to}
      className={`nav-link relative font-medium text-sm px-1 py-2 transition-all duration-300 ${
        active ? 'text-primary' : 'text-text-primary'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={e => {
        if (idTarget && window.location.pathname === '/' && document.getElementById(idTarget)) {
          e.preventDefault();
          document.getElementById(idTarget).scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, '', `/#${idTarget}`);
        }
        if (onClick) onClick(e);
      }}
    >
      {children}
      <motion.div
        layoutId="underline"
        className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: active || hovered ? 1 : 0, scaleX: active || hovered ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformOrigin: 'center' }}
      />
    </Link>
  );
};

export default Navbar;
