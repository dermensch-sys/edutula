import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, BarChart3, Database, CheckSquare, Brain, MessageCircle, Star, Users, Trophy, Clock, RotateCcw } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Теория',
      description: 'Комплексные учебные материалы и концептуальные основы',
      path: '/theory',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Анализ задач',
      description: 'Пошаговый разбор сложных задач',
      path: '/analysis',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Database,
      title: 'База задач',
      description: 'Большая подборка практических задач',
      path: '/tasks',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: CheckSquare,
      title: 'Проверка домашнего задания',
      description: 'Автоматизированная проверка домашних заданий и обратная связь',
      path: '/homework',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Brain,
      title: 'Нейро-экзаменаторr',
      description: 'Адаптированное тестирование и оценка на основе искусственного интеллекта',
      path: '/examiner',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      icon: MessageCircle,
      title: 'Нейро-консультант',
      description: 'Получение персонализированной помощи',
      path: '/consultant',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      icon: RotateCcw,
      title: 'Интервальное повторение',
      description: 'Научно обоснованная система запоминания с оптимальными интервалами',
      path: '/repetition',
      color: 'bg-teal-100 text-teal-600'
    },
  ];

  const stats = [
    { icon: Users, value: '100+', label: 'Активных студентов' },
    { icon: Trophy, value: '95%', label: 'Показатель успешности' },
    { icon: Clock, value: '24/7', label: 'Поддержка' },
    { icon: Star, value: '4.9/5', label: 'Рейтинг' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
             Сдайте экзамены на отлично с помощью системы обучения с использованием
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> искусственного интеллекта</span>
              <br />
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Сделайте эффективным свой процесс обучения с помощью нашей комплексной платформы для подготовки к экзаменам. Получите персонализированные учебные планы, мгновенную обратную связь и экспертную поддержку.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/theory"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Начните обучение
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/examiner"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                Пройдите пробный тест
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Всё, что вам нужно для успеха
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              аша комплексная платформа предоставляет все инструменты и ресурсы, необходимые для эффективного обучения и подготовки к экзаменам.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={feature.path}
                    className="group block bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-200">
                      Перейти <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы изменить свой процесс обучения?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Присоединяйтесь к обучающимся, которые достигли своих целей с помощью нашей платформы.
            </p>
            <Link
              to="/theory"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
             Начните сегодня
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;