import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, Clock, Star, ChevronRight, Bookmark, Play, CheckCircle } from 'lucide-react';
import AITest from '../components/AITest';

const TaskBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAITest, setShowAITest] = useState(false);

  const subjects = [
    { id: 'all', name: 'Все темы' },
    { id: 'mathematics', name: 'Математика' },
    { id: 'physics', name: 'Информатика' },
    { id: 'chemistry', name: 'Искусственный интеллект' },
    { id: 'biology', name: 'ЕГЭ' },
    { id: 'literature', name: 'ОГЭ' },
  ];

  const difficulties = [
    { id: 'all', name: 'Все уровни' },
    { id: 'beginner', name: 'Лёгкий' },
    { id: 'intermediate', name: 'Средний' },
    { id: 'advanced', name: 'Сложный' },
  ];

  const types = [
    { id: 'all', name: 'Все типы' },
    { id: 'multiple-choice', name: 'Множественный выбор' },
    { id: 'short-answer', name: 'Краткий ответ' },
    { id: 'essay', name: 'Эссе' },
    { id: 'problem-solving', name: 'Проблемные задания' },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Производные',
      subject: 'mathematics',
      difficulty: 'Средний',
      type: 'problem-solving',
      timeEstimate: '40 мин',
      rating: 4.8,
      completions: 1247,
      description: 'Найдите производные сложных функций, используя правило цепочки.',
      tags: ['Дифференциальное исчисление', 'Производные'],
      isCompleted: true,
      isSaved: false
    },
    {
      id: 2,
      title: 'Теория графов',
      subject: 'physics',
      difficulty: 'Сложный',
      type: 'multiple-choice',
      timeEstimate: '50 мин',
      rating: 4.9,
      completions: 892,
      description: 'Основные понятия теории графов и задачи, решаемые с помощью графов',
      tags: ['Графы', 'Моделирование', 'Кратчайшее расстояние'],
      isCompleted: false,
      isSaved: true
    },
    {
      id: 3,
      title: 'Основы искусственного интеллекта',
      subject: 'chemistry',
      difficulty: 'Начинающий',
      type: 'short-answer',
      timeEstimate: '25 мин',
      rating: 4.7,
      completions: 634,
      description: 'Подробное руководство по основым понятиям ИИ и их применению.',
      tags: ['ИИ', 'Нейронные сети', 'Машинное обучение'],
      isCompleted: false,
      isSaved: false
    },
    {
      id: 4,
      title: 'Решение арифметических задач',
      subject: 'biology',
      difficulty: 'Начинающий',
      type: 'essay',
      timeEstimate: '30 мин',
      rating: 4.6,
      completions: 1523,
      description: 'Решение проствх арифметических задач с недостатком и избытком.',
      tags: ['Проценты', 'Отношения', 'Округления'],
      isCompleted: true,
      isSaved: true
    },
    {
      id: 5,
      title: 'Решение текстовых задач',
      subject: 'literature',
      difficulty: 'Средний',
      type: 'multiple-choice',
      timeEstimate: '48 мин',
      rating: 4.5,
      completions: 2156,
      description: 'Решение типовых задач с помощью составления уравнения',
      tags: ['Уравнение', 'Текстовые задачи', 'Таблица'],
      isCompleted: false,
      isSaved: false
    },
    {
      id: 6,
      title: 'Квадратные уравнения',
      subject: 'mathematics',
      difficulty: 'Начинающий',
      type: 'problem-solving',
      timeEstimate: '20 мин',
      rating: 4.4,
      completions: 3247,
      description: 'Решение квадратных уравненйя, используя различные методы.',
      tags: ['Алгебра', 'Квадратные уравнения', 'Дискриминант'],
      isCompleted: true,
      isSaved: false
    },
    {
      id: 7,
      title: 'Системы счисления',
      subject: 'physics',
      difficulty: 'Начинающий',
      type: 'short-answer',
      timeEstimate: '30 мин',
      rating: 4.8,
      completions: 987,
      description: 'Основные понятия систем счисления, переводы и арифметические операции',
      tags: ['Двоичная', 'Позиционная', 'тетрады'],
      isCompleted: false,
      isSaved: true
    },
    {
      id: 8,
      title: 'Машинное обучение',
      subject: 'chemistry',
      difficulty: 'Сложный',
      type: 'problem-solving',
      timeEstimate: '70 мин',
      rating: 4.7,
      completions: 756,
      description: 'Рассмотрение этапов разработки проекта с помощью машинного обучения',
      tags: ['Нейронные сети', 'Компьютерное зрение', 'Робототехника'],
      isCompleted: false,
      isSaved: false
    },
  ];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || task.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || task.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || task.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'mathematics': return 'bg-blue-100 text-blue-700';
      case 'physics': return 'bg-purple-100 text-purple-700';
      case 'chemistry': return 'bg-orange-100 text-orange-700';
      case 'biology': return 'bg-green-100 text-green-700';
      case 'literature': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartTask = (taskId: number) => {
    if (taskId === 3) { // Основы искусственного интеллекта
      setShowAITest(true);
    } else {
      // Обработка других заданий
      console.log('Выполнить тест:', taskId);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">База заданий</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Потренируйтесь с помощью нашей обширной базы задач и упражнений. Используйте фильтры по теме, сложности и типу, чтобы найти подходящие задания для ваших учебных потребностей.
           
          </p>
          <p> <a href="http://edutula.h1n.ru/">
             Перейти к полной базе вопросов            
          </a></p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getSubjectColor(task.subject)}`}>
                      {subjects.find(s => s.id === task.subject)?.name}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <button className={`p-1 rounded-lg transition-colors ${
                      task.isSaved ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100'
                    }`}>
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {task.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {task.timeEstimate}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      {task.rating}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {task.completions.toLocaleString()} completed
                  </span>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleStartTask(task.id)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 group"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {task.isCompleted ? 'Выполнить заново' : 'Выполнить задание'}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
          </div>
        )}

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mt-12 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Статистика базы задач</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold">{tasks.length}</div>
              <div className="text-blue-100">Всего задач</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{subjects.length - 1}</div>
              <div className="text-blue-100">Темы</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{tasks.filter(t => t.isCompleted).length}</div>
              <div className="text-blue-100">Завершено</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{tasks.filter(t => t.isSaved).length}</div>
              <div className="text-blue-100">Сохранено</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Test Modal */}
      {showAITest && (
        <AITest onClose={() => setShowAITest(false)} />
      )}
    </div>
  );
};

export default TaskBase;