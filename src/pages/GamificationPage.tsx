import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import GamificationDashboard from '../components/GamificationDashboard';

const GamificationPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к главной
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Система достижений
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Отслеживайте свой прогресс, получайте очки за обучение и открывайте достижения. 
              Система фокусируется на личном росте и постоянном развитии.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 mb-8 border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Как работает система</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Выполняйте задания</h3>
                <p className="text-sm text-gray-600">Проходите тесты, изучайте теорию, повторяйте материал</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Получайте очки</h3>
                <p className="text-sm text-gray-600">За правильные ответы, завершение курсов и постоянство</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Открывайте достижения</h3>
                <p className="text-sm text-gray-600">Получайте награды за особые успехи и вехи</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Повышайте уровень</h3>
                <p className="text-sm text-gray-600">Прогрессируйте и открывайте новые возможности</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <GamificationDashboard />
      </div>
    </div>
  );
};

export default GamificationPage;