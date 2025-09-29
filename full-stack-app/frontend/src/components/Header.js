import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User as UserIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-2xl font-bold text-primary dark:text-primary-dark">
              NotesApp
            </Link>
          </motion.div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-text dark:text-text-dark hidden md:block">Welcome, {user?.username}!</span>
                <Link to="/profile" className="text-gray-600 hover:text-primary dark:hover:text-primary-dark transition-colors duration-300">
                  <UserIcon size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary dark:hover:text-primary-dark transition-colors duration-300">
                  Login
                </Link>
                <Link to="/signup" className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} className="text-yellow-400" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;