
import React from 'react';
import { User } from '../types';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from './icons/Icons';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="h-8 w-8 text-blue-600 dark:text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Broto<span className="text-blue-600 dark:text-blue-500">Care</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
             <UserCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            <span className="hidden md:inline text-gray-700 dark:text-gray-200 font-medium">{currentUser.name} ({currentUser.role})</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 mr-1" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
