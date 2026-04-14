import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Companies', path: '/companies' },
    { name: 'Compare', path: '/compare' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
          IPOLens
        </Link>
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-green-600 border-b-2 border-green-600 pb-1'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search IPOs..."
            className="pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-md text-sm focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none w-64 transition-all"
          />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          RK
        </div>
      </div>
    </nav>
  );
}