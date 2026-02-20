import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target, Calendar, TrendingUp, Award, Clock, Brain, Medal, Crown, Gem } from 'lucide-react';
import { gamificationSystem, Achievement, UserStats, ProgressEntry } from '../utils/gamification';

const GamificationDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [nextAchievements, setNextAchievements] = useState<Array<Achievement & { progress: number }>>([]);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUserStats(gamificationSystem.getUserStats());
    setRecentAchievements(gamificationSystem.getRecentAchievements());
    setNextAchievements(gamificationSystem.getNextAchievements());
    setProgressData(gamificationSystem.getProgressData(30));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Medal className="h-4 w-4" />;
      case 'rare': return <Star className="h-4 w-4" />;
      case 'epic': return <Crown className="h-4 w-4" />;
      case 'legendary': return <Gem className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <Brain className="h-5 w-5" />;
      case 'consistency': return <Calendar className="h-5 w-5" />;
      case 'mastery': return <Target className="h-5 w-5" />;
      case 'milestone': return <Trophy className="h-5 w-5" />;
      case 'special': return <Zap className="h-5 w-5" />;
      default: return <Award className="h-5 w-5" />;
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  if (!userStats) {
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
      {/* User Level and Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Уровень {userStats.level}</h2>
            <p className="text-blue-100">
              {userStats.experiencePoints} / {userStats.experienceToNextLevel} XP до следующего уровня
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
            <div className="text-blue-100">Общий счёт</div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 mb-4">
          <div
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${(userStats.experiencePoints / userStats.experienceToNextLevel) * 100}%` 
            }}
          ></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold">{userStats.currentStreak}</div>
            <div className="text-xs text-blue-100">Текущая серия</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{userStats.longestStreak}</div>
            <div className="text-xs text-blue-100">Лучшая серия</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{Math.round(userStats.averageAccuracy)}%</div>
            <div className="text-xs text-blue-100">Точность</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{formatTimeSpent(userStats.timeSpentLearning)}</div>
            <div className="text-xs text-blue-100">Время обучения</div>
          </div>
        </div>
      </motion.div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Недавние достижения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex items-center space-x-1">
                    {getRarityIcon(achievement.rarity)}
                    <span className="text-xs font-medium capitalize">{achievement.rarity}</span>
                  </div>
                </div>
                <h4 className="font-semibold mb-1">{achievement.name}</h4>
                <p className="text-xs opacity-80 mb-2">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">+{achievement.points} очков</span>
                  <span className="text-xs opacity-60">
                    {achievement.unlockedAt?.toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Ближайшие достижения
        </h3>
        <div className="space-y-4">
          {nextAchievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {getRarityIcon(achievement.rarity)}
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">+{achievement.points}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Прогресс: {Math.round(achievement.progress)}%
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(achievement.progress)}`}
                    style={{ width: `${Math.min(100, achievement.progress)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Прогресс за последние 30 дней
        </h3>
        
        {progressData.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const dayData = progressData.filter(entry => 
                  entry.date.toDateString() === date.toDateString()
                );
                const totalPoints = dayData.reduce((sum, entry) => sum + entry.points, 0);
                
                return (
                  <div
                    key={i}
                    className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      totalPoints > 0 
                        ? totalPoints > 100 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-200 text-green-800'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    title={`${date.toLocaleDateString()}: ${totalPoints} очков`}
                  >
                    {totalPoints > 0 ? totalPoints : ''}
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>30 дней назад</span>
              <span>Сегодня</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Нет активности</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span className="text-gray-600">Низкая активность</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Высокая активность</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Начните обучение, чтобы увидеть свой прогресс</p>
          </div>
        )}
      </motion.div>

      {/* Personal Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {userStats.totalCorrectAnswers}
          </div>
          <div className="text-sm text-gray-600">Правильных ответов</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {userStats.totalSessions}
          </div>
          <div className="text-sm text-gray-600">Сессий завершено</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.floor((Date.now() - userStats.joinDate.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-gray-600">Дней с нами</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {gamificationSystem.getUnlockedAchievements().length}
          </div>
          <div className="text-sm text-gray-600">Достижений получено</div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamificationDashboard;