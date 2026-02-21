import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, BookOpen, Target, TrendingUp, Calendar, Award, Edit2, Save, X } from 'lucide-react';
import { authService, User as UserType } from '../utils/auth';
import { educationalTrajectoryService } from '../utils/educationalTrajectory';
import { gamificationSystem } from '../utils/gamification';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserType>>({});
  const [learningStats, setLearningStats] = useState<any>(null);
  const [gamificationStats, setGamificationStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setEditData(currentUser || {});
      
      if (currentUser) {
        const stats = educationalTrajectoryService.getLearningStats(currentUser.id);
        setLearningStats(stats);
        setGamificationStats(gamificationSystem.getUserStats());
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    if (user && editData) {
      authService.updateProfile(editData);
      setUser({ ...user, ...editData });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Профиль пользователя</h2>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-600 hover:text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-xl font-bold bg-white rounded-lg px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              )}
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Участник с {user.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Level and Progress */}
          {gamificationStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gamificationStats.level}</div>
                <div className="text-xs text-gray-600">Уровень</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{gamificationStats.totalPoints.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Очки</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gamificationStats.currentStreak}</div>
                <div className="text-xs text-gray-600">Дней подряд</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(gamificationStats.averageAccuracy)}%</div>
                <div className="text-xs text-gray-600">Точность</div>
              </div>
            </div>
          )}
        </div>

        {/* Learning Progress */}
        {learningStats && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Прогресс обучения
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{learningStats.completedSteps}</div>
                <div className="text-sm text-gray-600">Завершено шагов</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">{Math.round(learningStats.progress)}%</div>
                <div className="text-sm text-gray-600">Общий прогресс</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${learningStats.progress}%` }}
              ></div>
            </div>

            {learningStats.currentGoal && (
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-900">Текущая цель:</div>
                <div className="text-blue-800">{learningStats.currentGoal.title}</div>
              </div>
            )}
          </div>
        )}

        {/* Preferences */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            Настройки
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Уровень знаний
              </label>
              {isEditing ? (
                <select
                  value={editData.profile?.level || user.profile.level}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, level: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Начинающий</option>
                  <option value="intermediate">Средний</option>
                  <option value="advanced">Продвинутый</option>
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  {user.profile.level === 'beginner' ? 'Начинающий' :
                   user.profile.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ежедневная цель (минут)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={editData.preferences?.dailyGoal || user.preferences.dailyGoal}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, dailyGoal: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  {user.preferences.dailyGoal} минут
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Интересы
              </label>
              <div className="flex flex-wrap gap-2">
                {user.profile.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цели обучения
              </label>
              <div className="space-y-1">
                {user.profile.goals.map(goal => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;