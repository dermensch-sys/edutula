import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, ChevronRight, Search, Filter } from 'lucide-react';

const Theory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все темы' },
    { id: 'mathematics', name: 'Математика' },
    { id: 'physics', name: 'Информатика' },
    { id: 'chemistry', name: 'Искусственный интеллект' },
    { id: 'biology', name: 'ЕГЭ' },
    { id: 'literature', name: 'ОГЭ' },
  ];

  const theoryTopics = [
    {
      id: 1,
      title: 'Рациональные выражения',
      category: 'mathematics',
      description: 'Основные алгоритмы и формулы рацональных выражений',
      duration: '45 мин',
      difficulty: 'Начальный',
      rating: 4.8,
      progress: 65,
      topics: ['Преобразования рацинальных выражений', 'ФСУ']
    },
    {
      id: 2,
      title: 'Файлы и файловая система',
      category: 'physics',
      description: 'Основные понятия о файловой системе, её структуре',
      duration: '60 мин.',
      difficulty: 'Начальный',
      rating: 4.9,
      progress: 30,
      topics: ['Файл', 'Каталог', 'Путь к файлу']
    },
    {
      id: 3,
      title: 'Основы искусственного интеллекта',
      category: 'chemistry',
      description: 'Подробное руководство по основым понятиям ИИ и их применению',
      duration: '20 часов',
      difficulty: 'Средний',
      rating: 4.8,
      progress: 0,
      topics: ['ИИ', 'Нейронные сети', 'Машинное обучение']
    },
    {
      id: 4,
      title: 'Векторы',
      category: 'biology',
      description: 'Решение задач на определение координат векторов, скалярного произведения',
      duration: '40 мин',
      difficulty: 'Начинающий',
      rating: 4.6,
      progress: 90,
      topics: ['Вектор', 'Координаты', 'Скалярное произведение']
    },
    {
      id: 5,
      title: 'Решение практических задач',
      category: 'literature',
      description: 'Решение арифметических задач на нахождение расстояния, работу',
      duration: '55 мин',
      difficulty: 'Средний',
      rating: 4.8,
      progress: 45,
      topics: ['Расстояния между пунктами', 'Квартиры и участки']
    },
    {
      id: 6,
      title: 'Основы теории вероятностей',
      category: 'mathematics',
      description: 'Основные понятия теории вероятностей, классическая вероятность',
      duration: '55 мин.',
      difficulty: 'Средний',
      rating: 4.9,
      progress: 20,
      topics: ['Классическая вероятность', 'Случайное событие']
    },
  ];

  const filteredTopics = theoryTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Теория и концепции</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           Освойте основные понятия с помощью наших полноценных теоретических модулей. Каждая тема включает подробные объяснения, примеры и интерактивный контент.
          </p>
          <p>
            <a href="http://edutula.h1n.ru/">
              <b>Перейти к полной базе курсов</b>
            </a>
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search theory topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Theory Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {topic.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.topics.slice(0, 3).map((subtopic) => (
                    <span key={subtopic} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {subtopic}
                    </span>
                  ))}
                  {topic.topics.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      +{topic.topics.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {topic.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {topic.rating}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${topic.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 group">
                  {topic.id === 3 ? (
                    <Link to="/ai-fundamentals" className="flex items-center justify-center w-full">
                      {topic.progress > 0 ? 'Продолжить изучение' : 'Начать изучение'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : topic.id === 2 ? (
                    <Link to="/file-system-course" className="flex items-center justify-center w-full">
                      {topic.progress > 0 ? 'Продолжить изучение' : 'Начать изучение'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : topic.id === 1 ? (
                    <Link to="/rational-expressions-course" className="flex items-center justify-center w-full">
                      {topic.progress > 0 ? 'Продолжить изучение' : 'Начать изучение'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : topic.id === 6 ? (
                    <Link to="/probability-theory-course" className="flex items-center justify-center w-full">
                      {topic.progress > 0 ? 'Продолжить изучение' : 'Начать изучение'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <>
                      {topic.progress > 0 ? 'Продолжить изучение' : 'Начать изучение'}
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all topics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Theory;