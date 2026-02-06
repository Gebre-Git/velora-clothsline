import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
const Header: React.FC<{ isAdmin?: boolean; onLogout?: () => void }> = ({ isAdmin = false, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinkStyle = {
    fontWeight: '700',
    color: isScrolled ? '#005d5a' : '#ffffff', // Teal when scrolled, White when top
  };

  const linkClass = `transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-velora-green' : 'text-white/90 hover:text-white'
    }`;

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
            <span className={`flex items-center text-4xl font-extrabold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-[#005d5a]' : 'text-white'}`}>
              V<StylizedE />LORA<sup className="text-sm ml-1 top-0 opacity-80">TM</sup>
            </span>
          </NavLink>
          <nav className="flex items-center space-x-8 text-lg font-medium">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
