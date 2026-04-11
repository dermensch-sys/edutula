import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, BookOpen, BarChart3, Database, CheckSquare, Brain, MessageCircle, GraduationCap, RotateCcw, Trophy, User, LogIn, Route, Shield } from 'lucide-react';
import { authService } from '../utils/auth';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import LearningTrajectory from './LearningTrajectory';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser());
  const location = useLocation();

  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { name: 'Теория', path: '/theory', icon: BookOpen },
    { name: 'Анализ', path: '/analysis', icon: BarChart3 },
    { name: 'База задач', path: '/tasks', icon: Database },
    { name: 'Проверка ДЗ', path: '/homework', icon: CheckSquare },
    { name: 'Нейроэкзаменатор', path: '/examiner', icon: Brain },
    { name: 'Нейроконсультант', path: '/consultant', icon: MessageCircle },
    { name: 'Повторение', path: '/repetition', icon: RotateCcw },
    { name: 'Достижения', path: '/gamification', icon: Trophy },
  ];

  const adminItem = { name: 'Администратор', path: '/admin', icon: Shield };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Система обучения</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <Link
              to={adminItem.path}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === adminItem.path
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>{adminItem.name}</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              {user ? (
                <>
                  <button
                    onClick={() => setShowTrajectory(true)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Route className="h-4 w-4" />
                    <span>Траектория</span>
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Войти</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <Link
              to={adminItem.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                location.pathname === adminItem.path
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>{adminItem.name}</span>
            </Link>
            
            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setShowTrajectory(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 w-full"
                  >
                    <Route className="h-5 w-5" />
                    <span>Траектория</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 w-full"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 w-full"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Войти</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
      
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
      
      <LearningTrajectory
        isOpen={showTrajectory}
        onClose={() => setShowTrajectory(false)}
      />
    </nav>
  );
};

export default Navbar;