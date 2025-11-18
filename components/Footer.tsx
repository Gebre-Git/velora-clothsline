import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-velora-dark text-velora-light mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} VELORA™ Inc. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">Effortless Drying, Reimagined for Modern Living.</p>
         <p className="text-sm text-gray-500 mt-4">For customer inquiries, please email: <a href="mailto:velora.support@gmail.com" className="hover:text-velora-accent">velora.support@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;