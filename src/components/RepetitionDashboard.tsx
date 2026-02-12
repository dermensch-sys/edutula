import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Brain, TrendingUp, Target, Award, BarChart3, Play, Settings } from 'lucide-react';
import { repetitionSystem } from '../utils/intervalRepetition';
import RepetitionSession from './RepetitionSession';

const RepetitionDashboard: React.FC = () => {
  const [showSession, setShowSession] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [dueItems, setDueItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const stats = repetitionSystem.getStatistics();
    const due = repetitionSystem.getDueItems();
    setStatistics(stats);
    setDueItems(due);
  };

  const handleSessionComplete = (results: { accuracy: number; duration: number }) => {
    setShowSession(false);
    loadData(); // Refresh data after session
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-100';
    if (streak >= 14) return 'text-blue-600 bg-blue-100';
    if (streak >= 7) return 'text-green-600 bg-green-100';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatNextReview = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Просрочено';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    return `Через ${diffDays} дн.`;
  };

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Интервальное повторение</h2>
          <p className="text-gray-600">Оптимизированное запоминание с помощью научно обоснованных интервалов</p>
        </div>
        <button
          onClick={() => setShowSession(true)}
          disabled={dueItems.length === 0}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4 mr-2" />
          Начать сессию (15 мин)
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{statistics.totalItems}</span>
          </div>
          <h3 className="font-medium text-gray-900">Всего элементов</h3>
          <p className="text-sm text-gray-600">В системе повторения</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{statistics.dueItems}</span>
          </div>
          <h3 className="font-medium text-gray-900">К повторению</h3>
          <p className="text-sm text-gray-600">Готово для изучения</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{statistics.averageAccuracy}%</span>
          </div>
          <h3 className="font-medium text-gray-900">Средняя точность</h3>
          <p className="text-sm text-gray-600">За все сессии</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${getStreakColor(statistics.streakDays).replace('text-', 'bg-').replace('-600', '-100')}`}>
              <Award className={`h-6 w-6 ${getStreakColor(statistics.streakDays).split(' ')[0]}`} />
            </div>
            <span className="text-2xl font-bold text-gray-900">{statistics.streakDays}</span>
          </div>
          <h3 className="font-medium text-gray-900">Дней подряд</h3>
          <p className="text-sm text-gray-600">Текущая серия</p>
        </motion.div>
      </div>

      {/* Today's Session Preview */}
      {dueItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Сегодняшняя сессия</h3>
                <p className="text-sm text-gray-600">15-минутное повторение готово</p>
              </div>
            </div>
            <button
              onClick={() => setShowSession(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="h-4 w-4 mr-2" />
              Начать
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">{dueItems.length}</div>
              <div className="text-xs text-gray-600">Элементов к повторению</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">~15</div>
              <div className="text-xs text-gray-600">Минут на сессию</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(dueItems.reduce((sum, item) => sum + (item.difficulty === 'hard' ? 3 : item.difficulty === 'medium' ? 2 : 1), 0) / dueItems.length * 10) / 10}
              </div>
              <div className="text-xs text-gray-600">Средняя сложность</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Statistics */}
      {Object.keys(statistics.categoryStats).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Прогресс по категориям</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(statistics.categoryStats).map(([category, stats]: [string, any]) => {
              const progress = stats.total > 0 ? (stats.mastered / stats.total) * 100 : 0;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 capitalize">{category}</span>
                    <span className="text-sm text-gray-600">
                      {stats.mastered}/{stats.total} освоено
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Upcoming Reviews */}
      {dueItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ближайшие повторения</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {dueItems.slice(0, 10).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">
                    {item.content.substring(0, 60)}...
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {item.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                      item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatNextReview(new Date(item.nextReview))}
                  </div>
                  <div className="text-xs text-gray-500">
                    Повтор #{item.repetitionCount + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {dueItems.length === 0 && statistics.totalItems === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Начните изучение</h3>
          <p className="text-gray-600 mb-6">
            Пройдите тесты или изучите теоретические материалы, чтобы добавить элементы в систему повторения
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Перейти к теории
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Пройти тест
            </button>
          </div>
        </motion.div>
      )}

      {/* Repetition Session Modal */}
      {showSession && (
        <RepetitionSession
          onComplete={handleSessionComplete}
          onClose={() => setShowSession(false)}
        />
      )}
    </div>
  );
};

export default RepetitionDashboard;