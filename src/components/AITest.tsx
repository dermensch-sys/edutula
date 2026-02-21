import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Clock, Award, AlertTriangle, Brain, TrendingUp, Calendar, RotateCcw } from 'lucide-react';
import { repetitionSystem } from '../utils/intervalRepetition';
import { gamificationSystem } from '../utils/gamification';
import { authService } from '../utils/auth';
import { educationalTrajectoryService } from '../utils/educationalTrajectory';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface AITestProps {
  onClose: () => void;
}

const AITest: React.FC<AITestProps> = ({ onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 минут

  const questions: Question[] = [
    {
      id: 1,
      question: "Что такое искусственный интеллект?",
      options: [
        "Компьютерная программа для игр",
        "Область компьютерных наук, занимающаяся созданием интеллектуальных машин",
        "Робот с человеческим лицом",
        "Система управления базами данных"
      ],
      correctAnswer: 1,
      explanation: "ИИ — это область компьютерных наук, которая занимается созданием интеллектуальных машин, способных работать и реагировать как люди."
    },
    {
      id: 2,
      question: "Кто ввел термин 'искусственный интеллект'?",
      options: [
        "Алан Тьюринг",
        "Джон Маккарти",
        "Марвин Минский",
        "Клод Шеннон"
      ],
      correctAnswer: 1,
      explanation: "Джон Маккарти ввел термин 'искусственный интеллект' на Дартмутской конференции в 1956 году."
    },
    {
      id: 3,
      question: "Что такое машинное обучение?",
      options: [
        "Обучение людей работе с машинами",
        "Подраздел ИИ, который позволяет компьютерам учиться без явного программирования",
        "Процесс сборки роботов",
        "Изучение механики машин"
      ],
      correctAnswer: 1,
      explanation: "Машинное обучение — это подраздел ИИ, который дает компьютерам способность учиться без явного программирования."
    },
    {
      id: 4,
      question: "Какой тест используется для оценки способности машины к интеллектуальному поведению?",
      options: [
        "Тест Роршаха",
        "Тест Тьюринга",
        "IQ тест",
        "Тест Стэнфорд-Бине"
      ],
      correctAnswer: 1,
      explanation: "Тест Тьюринга, предложенный Аланом Тьюрингом в 1950 году, используется для оценки способности машины демонстрировать интеллектуальное поведение, эквивалентное человеческому."
    },
    {
      id: 5,
      question: "Что такое нейронная сеть?",
      options: [
        "Сеть компьютеров",
        "Вычислительная модель, вдохновленная биологическими нейронными сетями",
        "Интернет-соединение",
        "Система проводов в роботе"
      ],
      correctAnswer: 1,
      explanation: "Нейронная сеть — это вычислительная модель, вдохновленная структурой и функционированием биологических нейронных сетей в мозге."
    },
    {
      id: 6,
      question: "Какой тип обучения не требует размеченных данных?",
      options: [
        "Обучение с учителем",
        "Обучение без учителя",
        "Обучение с подкреплением",
        "Глубокое обучение"
      ],
      correctAnswer: 1,
      explanation: "Обучение без учителя (unsupervised learning) не требует размеченных данных и находит скрытые закономерности в данных."
    },
    {
      id: 7,
      question: "Что такое глубокое обучение?",
      options: [
        "Изучение океанских глубин",
        "Подраздел машинного обучения с нейронными сетями, имеющими много слоев",
        "Очень сложное обучение",
        "Обучение в темноте"
      ],
      correctAnswer: 1,
      explanation: "Глубокое обучение — это подраздел машинного обучения, использующий нейронные сети с множественными слоями для моделирования и понимания сложных паттернов."
    },
    {
      id: 8,
      question: "Какая область ИИ занимается пониманием и генерацией человеческого языка?",
      options: [
        "Компьютерное зрение",
        "Обработка естественного языка (NLP)",
        "Робототехника",
        "Экспертные системы"
      ],
      correctAnswer: 1,
      explanation: "Обработка естественного языка (NLP) — это область ИИ, которая занимается взаимодействием между компьютерами и человеческим языком."
    },
    {
      id: 9,
      question: "Что такое алгоритм?",
      options: [
        "Математическая формула",
        "Пошаговая процедура для решения задачи",
        "Компьютерная программа",
        "Тип данных"
      ],
      correctAnswer: 1,
      explanation: "Алгоритм — это четкая пошаговая процедура или набор правил для решения конкретной задачи или проблемы."
    },
    {
      id: 10,
      question: "Какой тип ИИ существует в настоящее время?",
      options: [
        "Общий ИИ (AGI)",
        "Узкий ИИ (Narrow AI)",
        "Сверхинтеллект",
        "Сознательный ИИ"
      ],
      correctAnswer: 1,
      explanation: "В настоящее время существует только узкий ИИ (Narrow AI), который специализируется на конкретных задачах, таких как распознавание изображений или игра в шахматы."
    }
  ];

  React.useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinishTest();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = () => {
    setShowResults(true);
    
    // Get current user
    const user = authService.getCurrentUser();
    
    // Calculate points and update gamification system
    const correctAnswers = calculateScore();
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = Math.round((Date.now() - Date.now()) / 60000); // Placeholder for actual time
    
    // Award points for test completion
    const { points, multiplier } = gamificationSystem.calculatePoints('test_completion', {
      accuracy,
      totalQuestions: questions.length,
      timeSpent
    });
    
    const totalPoints = gamificationSystem.awardPoints('AI Test Completion', 'ai-fundamentals', points, multiplier);
    
    // Award points for each correct answer
    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
        const { points: answerPoints, multiplier: answerMultiplier } = gamificationSystem.calculatePoints('correct_answer', {
          difficulty: question.difficulty || 'medium',
          category: question.category || 'ai-fundamentals'
        });
        gamificationSystem.awardPoints('Correct Answer', question.category || 'ai-fundamentals', answerPoints, answerMultiplier);
      }
    });
    
    // Update user statistics
    gamificationSystem.updateStats({
      totalSessions: gamificationSystem.getUserStats().totalSessions + 1,
      totalCorrectAnswers: gamificationSystem.getUserStats().totalCorrectAnswers + correctAnswers,
      totalQuestions: gamificationSystem.getUserStats().totalQuestions + questions.length,
      averageAccuracy: accuracy,
      timeSpentLearning: gamificationSystem.getUserStats().timeSpentLearning + timeSpent
    });
    
    // Check for perfect score achievement
    if (accuracy === 100) {
      gamificationSystem.awardPoints('Perfect Score', 'achievement', 100, 1);
    }
    
    // Create or adapt educational trajectory based on test results
    if (user) {
      const testResults = questions.map((question, index) => ({
        questionId: question.id,
        question: question.question,
        category: question.category || 'ai-fundamentals',
        difficulty: question.difficulty || 'medium',
        isCorrect: selectedAnswers[index] === question.correctAnswer,
        userAnswer: selectedAnswers[index],
        correctAnswer: question.correctAnswer,
        topic: question.category || 'general'
      }));
      
      // Check if user already has a learning path
      const existingPath = educationalTrajectoryService.getUserPath(user.id);
      
      if (existingPath) {
        // Adapt existing path based on new results
        educationalTrajectoryService.adaptPath(user.id, testResults);
      } else {
        // Create new personalized path
        educationalTrajectoryService.createPersonalizedPath(user.id, testResults, user.profile);
      }
    }
    
    // Add incorrect answers to repetition system
    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      if (userAnswer !== undefined && userAnswer !== question.correctAnswer) {
        repetitionSystem.addItem(
          question.question,
          question.category || 'ai-fundamentals',
          question.difficulty || 'medium',
          'test-review'
        );
      }
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);

  // Analysis of results for repetition recommendations
  const analyzeResults = () => {
    const incorrectQuestions = questions.filter((question, index) => 
      selectedAnswers[index] !== undefined && selectedAnswers[index] !== question.correctAnswer
    );
    
    const categoryErrors: { [key: string]: number } = {};
    const totalByCategory: { [key: string]: number } = {};
    
    questions.forEach((question, index) => {
      const category = question.category || 'general';
      totalByCategory[category] = (totalByCategory[category] || 0) + 1;
      
      if (selectedAnswers[index] !== undefined && selectedAnswers[index] !== question.correctAnswer) {
        categoryErrors[category] = (categoryErrors[category] || 0) + 1;
      }
    });
    
    const weakAreas = Object.keys(categoryErrors).map(category => ({
      category,
      errorRate: (categoryErrors[category] / totalByCategory[category]) * 100,
      errorCount: categoryErrors[category],
      totalCount: totalByCategory[category]
    })).filter(area => area.errorRate > 0).sort((a, b) => b.errorRate - a.errorRate);
    
    return {
      incorrectQuestions,
      weakAreas,
      needsRepetition: incorrectQuestions.length > 0,
      criticalAreas: weakAreas.filter(area => area.errorRate >= 50),
      moderateAreas: weakAreas.filter(area => area.errorRate >= 25 && area.errorRate < 50),
      minorAreas: weakAreas.filter(area => area.errorRate < 25)
    };
  };

  const getRepetitionSchedule = (errorRate: number) => {
    if (errorRate >= 75) return { interval: '24 часа', priority: 'Критический', color: 'text-red-600 bg-red-100' };
    if (errorRate >= 50) return { interval: '2-3 дня', priority: 'Высокий', color: 'text-orange-600 bg-orange-100' };
    if (errorRate >= 25) return { interval: '1 неделя', priority: 'Средний', color: 'text-yellow-600 bg-yellow-100' };
    return { interval: '2 недели', priority: 'Низкий', color: 'text-green-600 bg-green-100' };
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      'ai-basics': 'Основы ИИ',
      'machine-learning': 'Машинное обучение',
      'neural-networks': 'Нейронные сети',
      'deep-learning': 'Глубокое обучение',
      'nlp': 'Обработка языка',
      'computer-vision': 'Компьютерное зрение',
      'ai-history': 'История ИИ',
      'algorithms': 'Алгоритмы',
      'general': 'Общие вопросы'
    };
    return categoryNames[category] || category;
  };

  if (showResults) {
    const analysis = analyzeResults();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {percentage >= 70 ? (
                <Award className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Тест завершен!</h2>
            <p className="text-xl text-gray-600">
              Ваш результат: {score} из {questions.length} ({percentage}%)
            </p>
            
            {/* Points Earned Display */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-gray-900">Очки получены!</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{gamificationSystem.calculatePoints('test_completion', { accuracy: percentage }).points} очков
                </div>
                <div className="text-sm text-gray-600">
                  За завершение теста + бонусы за правильные ответы
                </div>
              </div>
            </div>
          </div>

          {/* Repetition Analysis Alert */}
          {analysis.needsRepetition && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <RotateCcw className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Рекомендуется интервальное повторение
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Обнаружены пробелы в знаниях по {analysis.incorrectQuestions.length} вопросам. 
                    Эти материалы автоматически добавлены в систему интервального повторения для оптимального запоминания.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-red-600">{analysis.criticalAreas.length}</div>
                      <div className="text-xs text-gray-600">Критических областей</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{analysis.moderateAreas.length}</div>
                      <div className="text-xs text-gray-600">Умеренных проблем</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{analysis.incorrectQuestions.length}</div>
                      <div className="text-xs text-gray-600">Вопросов для повторения</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      +{gamificationSystem.calculatePoints('test_completion', { accuracy: percentage }).points}
                    </div>
                    <div className="text-xs text-gray-600">Очков получено</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Weak Areas Analysis */}
          {analysis.weakAreas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                Анализ слабых мест
              </h3>
              <div className="space-y-4">
                {analysis.weakAreas.map((area) => {
                  const schedule = getRepetitionSchedule(area.errorRate);
                  return (
                    <div key={area.category} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-gray-900">
                            {getCategoryDisplayName(area.category)}
                          </h4>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${schedule.color}`}>
                            {schedule.priority}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {area.errorCount}/{area.totalCount} ошибок
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(area.errorRate)}% ошибок
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Следующее повторение: {schedule.interval}</span>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              area.errorRate >= 75 ? 'bg-red-500' :
                              area.errorRate >= 50 ? 'bg-orange-500' :
                              area.errorRate >= 25 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(area.errorRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Question Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Подробный анализ ответов</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className={`border rounded-lg p-4 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start space-x-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {index + 1}. {question.question}
                          </h4>
                          {!isCorrect && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
                              Добавлено в повторение
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Ваш ответ: {userAnswer !== undefined ? question.options[userAnswer] : 'Не отвечено'}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-700">
                              Правильный ответ: {question.options[question.correctAnswer]}
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-gray-600 mt-2 italic">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {analysis.needsRepetition && (
              <button
                onClick={() => {
                  // Navigate to repetition page
                  window.location.href = '/repetition';
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Перейти к повторению
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Тест: Основы искусственного интеллекта
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </button>
  
          <div className="flex space-x-3">
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleFinishTest}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Завершить тест
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AITest;