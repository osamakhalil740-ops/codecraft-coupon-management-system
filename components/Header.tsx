
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from './icons/LogoIcon';
import { useTranslation } from '../hooks/useTranslation';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, setLanguage, language } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/80 border-b border-slate-900/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary transition-transform hover:scale-105">
          <LogoIcon className="h-8 w-8" />
          <span>CodeCraft</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
            <Link to="/marketplace" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('header.marketplace')}</Link>
            <Link to="/partner-with-us" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('header.partner')}</Link>
            <Link to="/affiliate-network" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">{t('header.affiliate')}</Link>
        </nav>
        <div className="flex items-center gap-4">
            <div className="relative">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                    className="appearance-none bg-transparent border-none text-sm font-medium text-gray-600 hover:text-primary focus:ring-0 pr-6 cursor-pointer"
                >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                </select>
                <GlobeAltIcon className="h-4 w-4 absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Role-specific credits display */}
              <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full shadow-soft">
                <span className="text-sm font-medium text-gray-700">
                  {user.roles.includes('shop-owner') ? '🏪' : 
                   user.roles.includes('affiliate') ? '📢' : 
                   user.roles.includes('admin') ? '👑' : '🛍️'}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {user.credits.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-medium">credits</span>
              </div>
              
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isSuperAdmin ? 'text-red-600 hover:text-red-800 font-bold' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {isSuperAdmin ? '👑 Super Admin' :
                 user.roles.includes('shop-owner') ? 'Business Hub' :
                 user.roles.includes('affiliate') ? 'Marketing Hub' :
                 user.roles.includes('admin') ? 'Admin Panel' : 'My Deals'}
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
              >
                {t('header.logout')}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
              {t('header.loginSignup')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;