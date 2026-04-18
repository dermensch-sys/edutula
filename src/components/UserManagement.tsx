import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Shield, ShieldOff, Mail, Calendar, Activity, Search, Eye, EyeOff } from 'lucide-react';
import { authService, User } from '../utils/auth';

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || user.profile.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleToggleAdmin = (user: User) => {
    setIsLoading(true);
    authService.setAdminRole(user.email, !user.isAdmin);
    loadUsers();
    setIsLoading(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Вы уверены? Это действие нельзя отменить.')) {
      setIsLoading(true);
      authService.deleteUser(userId);
      loadUsers();
      setSelectedUser(null);
      setIsLoading(false);
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-blue-600 bg-blue-50';
      case 'intermediate':
        return 'text-orange-600 bg-orange-50';
      case 'advanced':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Начинающий';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Управление пользователями</h2>
          <p className="text-gray-600 mt-1">Всего пользователей: {filteredUsers.length}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
        >
          ×
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все уровни</option>
          <option value="beginner">Начинающий</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Имя</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Уровень</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Присоединился</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Роль</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Действия</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedUser(user)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.profile.level)}`}>
                      {getLevelLabel(user.profile.level)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-gray-600 text-sm">{user.createdAt.toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-4">
                    {user.isAdmin ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        <Shield className="h-4 w-4 mr-1" />
                        Администратор
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <Activity className="h-4 w-4 mr-1" />
                        Пользователь
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAdmin(user);
                        }}
                        disabled={isLoading}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        title={user.isAdmin ? 'Убрать права администратора' : 'Дать права администратора'}
                      >
                        {user.isAdmin ? (
                          <ShieldOff className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                        disabled={isLoading}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Удалить пользователя"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Пользователи не найдены</p>
        </div>
      )}

      {/* User Detail Panel */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Детали пользователя</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Имя</p>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Уровень знаний</p>
                      <p className="text-lg font-medium text-gray-900">{getLevelLabel(selectedUser.profile.level)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Роль</p>
                      <p className="text-lg font-medium text-gray-900">
                        {selectedUser.isAdmin ? 'Администратор' : 'Пользователь'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">История</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Дата присоединения</p>
                        <p className="text-gray-900">{selectedUser.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Последний вход</p>
                        <p className="text-gray-900">{selectedUser.lastLoginAt.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Предпочтения</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Ежедневная цель</p>
                      <p className="text-gray-900">{selectedUser.preferences.dailyGoal} минут</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Язык</p>
                      <p className="text-gray-900">{selectedUser.preferences.language === 'ru' ? 'Русский' : 'English'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Тема</p>
                      <p className="text-gray-900">{selectedUser.preferences.theme === 'light' ? 'Светлая' : 'Темная'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Уведомления</p>
                      <p className="text-gray-900">{selectedUser.preferences.notifications ? 'Включены' : 'Отключены'}</p>
                    </div>
                  </div>
                </div>

                {/* Interests and Goals */}
                {(selectedUser.profile.interests.length > 0 || selectedUser.profile.goals.length > 0) && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Интересы и цели</h4>
                    {selectedUser.profile.interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Интересы:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.profile.interests.map(interest => (
                            <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedUser.profile.goals.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Цели обучения:</p>
                        <div className="space-y-1">
                          {selectedUser.profile.goals.map(goal => (
                            <p key={goal} className="text-gray-900 text-sm">• {goal}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleToggleAdmin(selectedUser);
                      setSelectedUser(null);
                    }}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {selectedUser.isAdmin ? (
                      <>
                        <ShieldOff className="h-5 w-5" />
                        <span>Убрать права администратора</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5" />
                        <span>Дать права администратора</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Удалить</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;
