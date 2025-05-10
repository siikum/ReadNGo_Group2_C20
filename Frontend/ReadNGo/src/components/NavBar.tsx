// src/components/Navbar.tsx
import React from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from './ui/button';

export interface NavbarProps {
  cartCount?: number;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartCount = 0,
  isLoggedIn = false,
  onLoginClick,
  onLogoutClick,
}) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ReadNGo</h1>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <Button
                onClick={onLogoutClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={onLoginClick}
                variant="default"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;