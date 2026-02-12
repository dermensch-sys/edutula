import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RepetitionDashboard from '../components/RepetitionDashboard';

const RepetitionPage: React.FC = () => {
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
              Интервальное повторение
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Научно обоснованная система запоминания, которая оптимизирует интервалы повторения 
              для максимальной эффективности обучения и долгосрочного запоминания.
            </p>
          </div>

          {/* How it works */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Как это работает</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Первое повторение</h3>
                <p className="text-sm text-gray-600">Через 24 часа после изучения</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Второе повторение</h3>
                <p className="text-sm text-gray-600">Через 7 дней</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Третье повторение</h3>
                <p className="text-sm text-gray-600">Через 16 дней</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">∞</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Дальнейшие повторения</h3>
                <p className="text-sm text-gray-600">С увеличивающимися интервалами</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <RepetitionDashboard />
      </div>
    </div>
  );
};

export default RepetitionPage;