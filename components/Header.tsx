import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkStyle = {
    color: '#005d5a',
    fontWeight: '600',
  };

  return (
    <header className="sticky top-0 z-50 bg-velora-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center space-x-3 text-3xl font-extrabold text-velora-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-velora-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16"/>
                <path d="M6 22V4h12v18"/>
                <path d="M9 4V2h6v2"/>
                <path d="M6 8h12"/>
                <path d="M6 12h12"/>
                <path d="M6 16h12"/>
            </svg>
            <span>VELORA™</span>
          </NavLink>
          <nav className="flex items-center space-x-6 text-lg font-medium text-gray-600">
            <NavLink
              to="/"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="hover:text-velora-green transition-colors duration-200"
            >
              Home
            </NavLink>
            <NavLink
              to="/guidelines"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="hover:text-velora-green transition-colors duration-200"
            >
              Guidelines
            </NavLink>
            <NavLink
              to="/admin"
              style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              className="hover:text-velora-green transition-colors duration-200"
            >
              Admin Panel
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;