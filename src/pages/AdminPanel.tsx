import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, Settings, BarChart3, Shield } from 'lucide-react';
import { authService } from '../utils/auth';
import AuthModal from '../components/AuthModal';

const AdminPanel: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminUser, setAdminUser] = useState(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setAdminUser(newUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    await authService.logout();
    setAdminUser(null);
    setIsLoading(false);
  };

  const adminMenuItems = [
    { title: 'Управление пользователями', icon: Users, description: 'Просмотр и управление учетными записями' },
    { title: 'Статистика', icon: BarChart3, description: 'Аналитика использования и активности' },
    { title: 'Безопасность', icon: Shield, description: 'Параметры безопасности и доступа' },
    { title: 'Настройки системы', icon: Settings, description: 'Конфигурация платформы' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!adminUser ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-[calc(100vh-200px)]"
          >
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Панель администратора</h1>
                <p className="text-gray-400">Требуется вход в систему для доступа</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAuthModal(true)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Войти в панель администратора
              </motion.button>

              <p className="text-center text-gray-400 text-sm mt-4">
                Только авторизованные администраторы имеют доступ
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Панель администратора</h1>
                <p className="text-gray-400">Добро пожаловать, {adminUser.name}</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="h-5 w-5" />
                <span>{isLoading ? 'Выход...' : 'Выход'}</span>
              </button>
            </div>

            {/* Admin Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 cursor-pointer hover:shadow-xl transition-all duration-200 border border-slate-600"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Общая статистика</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Всего пользователей', value: '0' },
                  { label: 'Активных сегодня', value: '0' },
                  { label: 'Завершено курсов', value: '0' },
                  { label: 'Системных ошибок', value: '0' },
                ].map((stat, index) => (
                  <div key={index} className="bg-slate-900 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
        onSuccess={() => {
          setShowAuthModal(false);
          const user = authService.getCurrentUser();
          setAdminUser(user);
        }}
      />
    </div>
  );
};

export default AdminPanel;
