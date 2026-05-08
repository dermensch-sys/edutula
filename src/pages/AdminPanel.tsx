import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, Settings, BarChart3, Shield, CreditCard as Edit2, Save, X, Cloud, AlertCircle } from 'lucide-react';
import { authService, User as UserType } from '../utils/auth';
import { dataSyncService } from '../utils/dataSync';
import AuthModal from '../components/AuthModal';
import UserManagement from '../components/UserManagement';

const AdminPanel: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminUser, setAdminUser] = useState(authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>({});
  const [activeSection, setActiveSection] = useState<'dashboard' | 'users' | null>(null);
  const [syncStatus, setSyncStatus] = useState(dataSyncService.getSyncStatus());

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setAdminUser(currentUser);
    setEditData(currentUser || {});

    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setAdminUser(newUser);
      setEditData(newUser || {});
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(dataSyncService.getSyncStatus());
    }, 5000); // Update sync status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    await authService.logout();
    setAdminUser(null);
    setIsLoading(false);
  };

  const handleSave = () => {
    if (adminUser && editData) {
      authService.updateProfile(editData);
      setAdminUser({ ...adminUser, ...editData });
      setIsEditing(false);
    }
  };

  const adminMenuItems = [
    { title: 'Управление пользователями', icon: Users, description: 'Просмотр и управление учетными записями' },
    { title: 'Статистика', icon: BarChart3, description: 'Аналитика использования и активности' },
    { title: 'Безопасность', icon: Shield, description: 'Параметры безопасности и доступа' },
    { title: 'Настройки системы', icon: Settings, description: 'Конфигурация платформы' },
  ];

  // If not logged in, show login prompt
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-3xl font-bold text-white mb-2">Требуется вход</h1>
                <p className="text-gray-400">Войдите в систему для доступа</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAuthModal(true)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                Войти в систему
              </motion.button>

              <p className="text-center text-gray-400 text-sm mt-4">
                У вас должна быть учетная запись
              </p>
            </div>
          </motion.div>
        </div>

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
  }

  // If logged in but not admin, show personal account instead
  if (!adminUser.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Мой профиль</h1>
                <p className="text-gray-600">Управление вашей учетной записью и настройками</p>
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

            {/* User Info Card */}
            <div className="bg-white rounded-xl p-8 mb-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Информация профиля</h2>
                  <p className="text-gray-600">Ваши персональные данные</p>
                </div>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{adminUser.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{adminUser.email}</div>
                </div>
              </div>
            </div>

            {/* Learning Settings */}
            <div className="bg-white rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Параметры обучения</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Уровень знаний</label>
                  {isEditing ? (
                    <select
                      value={editData.profile?.level || adminUser.profile.level}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        profile: { ...prev.profile!, level: e.target.value }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Начинающий</option>
                      <option value="intermediate">Средний</option>
                      <option value="advanced">Продвинутый</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {adminUser.profile.level === 'beginner' ? 'Начинающий' :
                       adminUser.profile.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ежедневная цель (минут)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="10"
                      max="180"
                      value={editData.preferences?.dailyGoal || adminUser.preferences.dailyGoal}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences!, dailyGoal: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{adminUser.preferences.dailyGoal} минут</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Интересы</label>
                <div className="flex flex-wrap gap-2">
                  {adminUser.profile.interests.length > 0 ? (
                    adminUser.profile.interests.map(interest => (
                      <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Не добавлены</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Admin view
  if (activeSection === 'users') {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setActiveSection('dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              ← Вернуться в панель
            </button>
          </div>
          <UserManagement onClose={() => setActiveSection('dashboard')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="flex items-center space-x-4">
              {/* Sync Status */}
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                dataSyncService.isFullySynced()
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-yellow-600/20 text-yellow-400'
              }`}>
                {dataSyncService.isFullySynced() ? (
                  <>
                    <Cloud className="h-5 w-5" />
                    <span className="text-sm">Синхронизировано</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                    <span className="text-sm">{syncStatus.pendingItems} ожидают</span>
                  </>
                )}
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
          </div>

          {/* Admin Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminMenuItems.map((item, index) => {
              const Icon = item.icon;
              const handleItemClick = () => {
                if (item.title === 'Управление пользователями') {
                  setActiveSection('users');
                }
              };

              return (
                <motion.button
                  key={index}
                  onClick={handleItemClick}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 hover:shadow-xl transition-all duration-200 border border-slate-600 text-left"
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
                </motion.button>
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
