
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Theme Park App
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/customers"
                className={`${isActive('/customers')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Clients
              </Link>
              <Link
                to="/rides"
                className={`${isActive('/rides')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Attractions
              </Link>
              <Link
                to="/bookings"
                className={`${isActive('/bookings')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Réservations
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <div className="sm:hidden border-t">
        <div className="grid grid-cols-3 text-center">
          <Link
            to="/customers"
            className={`${isActive('/customers')} py-3 text-sm font-medium transition-colors`}
          >
            Clients
          </Link>
          <Link
            to="/rides"
            className={`${isActive('/rides')} py-3 text-sm font-medium transition-colors`}
          >
            Attractions
          </Link>
          <Link
            to="/bookings"
            className={`${isActive('/bookings')} py-3 text-sm font-medium transition-colors`}
          >
            Réservations
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
