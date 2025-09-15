import React from 'react';
import { LogOut, Home, Package, Truck, ShoppingCart, Shield, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useApp();

  if (!user) return null;

  const getNavItems = () => {
    switch (user.role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'batches', label: 'My Batches', icon: Package },
          { id: 'profile', label: 'Profile', icon: UserIcon }
        ];
      case 'distributor':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'transfers', label: 'Transfers', icon: Truck },
          { id: 'profile', label: 'Profile', icon: UserIcon }
        ];
      case 'consumer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'scanner', label: 'QR Scanner', icon: ShoppingCart },
          { id: 'profile', label: 'Profile', icon: UserIcon }
        ];
      case 'regulator':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'audit', label: 'Audit', icon: Shield },
          { id: 'profile', label: 'Profile', icon: UserIcon }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-green-600">FarmSetu</h1>
            </div>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name} ({user.role})
            </span>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-1" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;