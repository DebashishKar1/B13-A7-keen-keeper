import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Timeline', path: '/timeline', icon: '⏱️' },
    { name: 'Stats', path: '/stats', icon: '📊' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-emerald-700 tracking-tight">
              KeenKeeper
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => toast.success(`Opened ${link.name}`)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-700 text-white shadow-md' 
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-2xl text-gray-600 hover:text-emerald-700 transition-colors"
          >
            {isMobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    toast.success(`Opened ${link.name}`);
                    setIsMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-base font-medium
                    ${isActive 
                      ? 'bg-emerald-700 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="text-xl">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;