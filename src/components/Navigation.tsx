
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Skull, Heart, Gamepad2, Film } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-red-600/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
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
                to="/fun-bingo"
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/fun-bingo') 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">Fun Bingo</span>
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
    </div>
  );
};

export default Navigation;
