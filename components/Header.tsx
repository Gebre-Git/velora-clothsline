import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
const Header: React.FC<{ isAdmin?: boolean; onLogout?: () => void }> = ({ isAdmin = false, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const activeLinkStyle = {
    fontWeight: '700',
    color: isScrolled ? '#005d5a' : '#ffffff', // Teal when scrolled, White when top
  };

  const linkClass = `transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-velora-green' : 'text-white/90 hover:text-white'
    }`;

  const mobileLinkClass = 'block py-3 px-4 text-gray-700 hover:bg-velora-green/10 hover:text-velora-green transition-colors duration-200 rounded-md';

  // Custom 'E' component using 3 bars
  const StylizedE = () => (
    <div className="inline-flex flex-col justify-between h-[0.7em] w-[0.6em] mx-[1px] translate-y-[0.05em]">
      <span className="w-full h-[0.16em] bg-current rounded-sm"></span>
      <span className="w-full h-[0.16em] bg-current rounded-sm"></span>
      <span className="w-full h-[0.16em] bg-current rounded-sm"></span>
    </div>
  );

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-velora-white/95 backdrop-blur-md shadow-sm py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between transition-all duration-300">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <span className={`flex items-center text-2xl md:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-[#005d5a]' : 'text-white'}`}>
              V<StylizedE />LORA<sup className="text-sm ml-1 top-0 opacity-80">TM</sup>
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
            <NavLink
              to="/"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className={linkClass}
            >
              Home
            </NavLink>
            <NavLink
              to="/guidelines"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className={linkClass}
            >
              Guidelines
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                className={linkClass}
              >
                Admin Panel
              </NavLink>
            )}
            {isAdmin && onLogout && (
              <button
                onClick={onLogout}
                className={`text-sm hover:underline ${isScrolled ? 'text-red-600' : 'text-red-300'}`}
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden hamburger-btn p-2 rounded-md transition-colors duration-300 ${isScrolled ? 'text-velora-dark hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mobile-menu mt-4 pb-4 animate-fade-in-up">
            <div className="bg-white rounded-lg shadow-xl p-4 space-y-2">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileLinkClass}
              >
                Home
              </NavLink>
              <NavLink
                to="/guidelines"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileLinkClass}
              >
                Guidelines
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  Admin Panel
                </NavLink>
              )}
              {isAdmin && onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
