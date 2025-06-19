
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Skull, Film, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-red-600/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo that toggles mobile menu */}
          <Button 
            variant="ghost" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center gap-2 px-0 hover:bg-transparent"
          >
            <div className="relative">
              <Skull className="w-6 h-6 text-red-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              Stardust
            </span>
            <div className="md:hidden ml-2">
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </div>
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Skull className="w-5 h-5" />
              <span className="font-medium">Horror Bingo</span>
            </Link>

            <Link 
              to="/movie-night"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/movie-night') 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Film className="w-5 h-5" />
              <span className="font-medium">Movie Night</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Skull className="w-5 h-5" />
                <span className="font-medium">Horror Bingo</span>
              </Link>

              <Link 
                to="/movie-night"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/movie-night') 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Film className="w-5 h-5" />
                <span className="font-medium">Movie Night</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
