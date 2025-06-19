
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Skull, Heart, Gamepad2, Film, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-red-600/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu className="max-w-full">
            <NavigationMenuList className="gap-8">
              <NavigationMenuItem>
                <Link 
                  to="/"
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/') 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Skull className="w-5 h-5" />
                  <span className="font-medium">Horror Bingo</span>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link 
                  to="/memories"
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive('/memories') 
                      ? 'bg-pink-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Amintiri Private</span>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-300 hover:text-white bg-transparent hover:bg-gray-800">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Mai Multe
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <div className="grid gap-2 w-48">
                      <Link 
                        to="/movie-night"
                        className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      >
                        <Film className="w-4 h-4" />
                        <span>Movie Night</span>
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-red-400" />
            <span className="font-bold text-white">Horror Bingo</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-2">
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
                <span>Horror Bingo</span>
              </Link>
              
              <Link
                to="/memories"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/memories') 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Amintiri Private</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
