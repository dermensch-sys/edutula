import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, Clock, Target, TrendingUp, Award, ChevronRight, Zap, BarChart, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { repetitionSystem } from '../utils/intervalRepetition';
import { gamificationSystem } from '../utils/gamification';
import { authService } from '../utils/auth';
import { educationalTrajectoryService } from '../utils/educationalTrajectory';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
}

interface TestSession {
  currentQuestion: number;
  score: number;
  answeredQuestions: number[];
  userAnswers: number[];
  difficulty: 'easy' | 'medium' | 'hard';
  isComplete: boolean;
  timeStarted: Date;
}

const NeuroExaminer: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'adaptive' | 'timed' | 'practice'>('adaptive');
  const [isStarted, setIsStarted] = useState(false);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  // AI-related questions from the document
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
      difficulty: 'easy',
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
      difficulty: 'medium',
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
      difficulty: 'easy',
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
      difficulty: 'medium',
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
      difficulty: 'easy',
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
      difficulty: 'medium',
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
      difficulty: 'hard',
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
      difficulty: 'medium',
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
      difficulty: 'easy',
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
      difficulty: 'medium',
      explanation: "В настоящее время существует только узкий ИИ (Narrow AI), который специализируется на конкретных задачах, таких как распознавание изображений или игра в шахматы."
    },
    {
      id: 11,
      question: "Что является основной целью обучения с подкреплением?",
      options: [
        "Классификация данных",
        "Максимизация награды через взаимодействие с средой",
        "Кластеризация данных",
        "Регрессионный анализ"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Обучение с подкреплением направлено на максимизацию совокупной награды через взаимодействие агента со средой."
    },
    {
      id: 12,
      question: "Что такое переобучение (overfitting) в машинном обучении?",
      options: [
        "Слишком быстрое обучение модели",
        "Когда модель слишком хорошо запоминает тренировочные данные и плохо обобщает",
        "Использование слишком большого количества данных",
        "Обучение модели слишком долго"
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: "Переобучение происходит, когда модель слишком точно подстраивается под тренировочные данные, теряя способность к обобщению на новых данных."
    }
  ];

  const examModes = [
    {
      id: 'adaptive' as const,
      title: 'Адаптивное тестирование',
      description: 'ИИ регулирует сложность в зависимости от Вашего уровня',
      icon: Brain,
      features: ['Персонализированная сложность', 'Оптимальный путь обучения', 'Адаптация в реальном времени'],
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'timed' as const,
      title: 'Экзамен с ограничением по времени',
      description: 'Имитация реальных условий экзамена',
      icon: Clock,
      features: ['Время как на экзамене', 'Показатели производительности', 'Стресс-тестирование'],
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'practice' as const,
      title: 'Режим тренировки',
      description: 'Практика в непринужденной обстановке с подробными объяснениями',
      icon: Target,
      features: ['Без спешки', 'Мгновенная обратная связь', 'Ориентировка на обучение'],
      color: 'bg-green-100 text-green-700 border-green-200'
    }
  ];

  const recentScores = [
    { subject: 'Математика', score: 92, trend: 'up', date: '2024-01-15' },
    { subject: 'Информатика', score: 88, trend: 'up', date: '2024-01-14' },
    { subject: 'ИИ', score: 85, trend: 'down', date: '2024-01-13' },
    { subject: 'ЕГЭ', score: 94, trend: 'up', date: '2024-01-12' },
  ];

  const achievements = [
    { title: 'Идеальный результат', description: 'Получил 100% баллов по математике', icon: Award, color: 'text-yellow-600' },
    { title: 'Мастер Серии', description: '7 дней тренировок подряд', icon: Zap, color: 'text-orange-600' },
    { title: 'Скоростной результат', description: 'Экзамен сдан в рекордно короткие сроки', icon: Clock, color: 'text-blue-600' },
    { title: 'Улучшение', description: 'В этом месяце оценка повысилась на 20%', icon: TrendingUp, color: 'text-green-600' },
  ];

  // Timer effect
  useEffect(() => {
    if (isStarted && selectedMode === 'timed' && timeLeft > 0 && !testSession?.isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testSession?.isComplete) {
      finishTest();
    }
  }, [timeLeft, isStarted, selectedMode, testSession?.isComplete]);

  const getNextQuestion = (currentDifficulty: 'easy' | 'medium' | 'hard', isCorrect: boolean): Question | null => {
    let targetDifficulty = currentDifficulty;
    
    if (selectedMode === 'adaptive') {
      if (isCorrect && currentDifficulty === 'easy') {
        targetDifficulty = 'medium';
      } else if (isCorrect && currentDifficulty === 'medium') {
        targetDifficulty = 'hard';
      } else if (!isCorrect && currentDifficulty === 'hard') {
        targetDifficulty = 'medium';
      } else if (!isCorrect && currentDifficulty === 'medium') {
        targetDifficulty = 'easy';
      }
    }

    const availableQuestions = questions.filter(q => 
      q.difficulty === targetDifficulty && 
      !testSession?.answeredQuestions.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      // If no questions of target difficulty, try any difficulty
      const anyAvailable = questions.filter(q => 
        !testSession?.answeredQuestions.includes(q.id)
      );
      return anyAvailable.length > 0 ? anyAvailable[0] : null;
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  };

  const startExam = () => {
    const firstQuestion = questions.find(q => q.difficulty === 'easy') || questions[0];
    setTestSession({
      currentQuestion: firstQuestion.id,
      score: 0,
      answeredQuestions: [],
      userAnswers: [],
      difficulty: 'easy',
      isComplete: false,
      timeStarted: new Date()
    });
    setIsStarted(true);
    setSelectedAnswer(null);
    setShowResult(false);
    if (selectedMode === 'timed') {
      setTimeLeft(1800); // Reset timer for timed mode
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !testSession) return;

    const currentQ = questions.find(q => q.id === testSession.currentQuestion);
    if (!currentQ) return;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const newScore = isCorrect ? testSession.score + 1 : testSession.score;
    
    const updatedSession = {
      ...testSession,
      score: newScore,
      answeredQuestions: [...testSession.answeredQuestions, currentQ.id],
      userAnswers: [...testSession.userAnswers, selectedAnswer]
    };

    // Show result for current question
    setShowResult(true);
    
    // After showing result, move to next question or finish
    setTimeout(() => {
      const nextQuestion = getNextQuestion(currentQ.difficulty, isCorrect);
      
      if (!nextQuestion || updatedSession.answeredQuestions.length >= 10) {
        // Test complete
        setTestSession({
          ...updatedSession,
          isComplete: true
        });
      } else {
        // Continue to next question
        setTestSession({
          ...updatedSession,
          currentQuestion: nextQuestion.id,
          difficulty: nextQuestion.difficulty
        });
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const finishTest = () => {
    if (testSession) {
      // Get current user
      const user = authService.getCurrentUser();
      
      // Calculate and award points
      const accuracy = Math.round((testSession.score / testSession.answeredQuestions.length) * 100);
      const timeSpent = Math.round((Date.now() - testSession.timeStarted.getTime()) / 60000);
      
      // Award points for adaptive test completion
      const { points, multiplier } = gamificationSystem.calculatePoints('test_completion', {
        accuracy,
        totalQuestions: testSession.answeredQuestions.length,
        timeSpent,
        isAdaptive: selectedMode === 'adaptive'
      });
      
      gamificationSystem.awardPoints('Adaptive Test', 'ai-fundamentals', points, multiplier);
      
      // Update user statistics
      gamificationSystem.updateStats({
        totalSessions: gamificationSystem.getUserStats().totalSessions + 1,
        totalCorrectAnswers: gamificationSystem.getUserStats().totalCorrectAnswers + testSession.score,
        totalQuestions: gamificationSystem.getUserStats().totalQuestions + testSession.answeredQuestions.length,
        averageAccuracy: accuracy,
        timeSpentLearning: gamificationSystem.getUserStats().timeSpentLearning + timeSpent
      });
      
      // Create or adapt educational trajectory
      if (user) {
        const testResults = questions.map((question, index) => ({
          questionId: question.id,
          question: question.question,
          category: 'ai-fundamentals',
          difficulty: question.difficulty,
          isCorrect: testSession.userAnswers[index] === question.correctAnswer,
          userAnswer: testSession.userAnswers[index],
          correctAnswer: question.correctAnswer,
          topic: 'ai-fundamentals'
        }));
        
        const existingPath = educationalTrajectoryService.getUserPath(user.id);
        
        if (existingPath) {
          educationalTrajectoryService.adaptPath(user.id, testResults);
        } else {
          educationalTrajectoryService.createPersonalizedPath(user.id, testResults, user.profile);
        }
      }
      
      // Add incorrect answers to repetition system
      questions.forEach((question, index) => {
        const userAnswerIndex = testSession.userAnswers[index];
        if (userAnswerIndex !== undefined && userAnswerIndex !== question.correctAnswer) {
          repetitionSystem.addItem(
            question.question,
            'ai-fundamentals',
            question.difficulty,
            'adaptive-test'
          );
        }
      });
      
      setTestSession({
        ...testSession,
        isComplete: true
      });
    }
  };

  const restartTest = () => {
    setIsStarted(false);
    setTestSession(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(1800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = testSession ? questions.find(q => q.id === testSession.currentQuestion) : null;
  const progress = testSession ? (testSession.answeredQuestions.length / 10) * 100 : 0;

  if (isStarted && testSession?.isComplete) {
    const percentage = Math.round((testSession.score / testSession.answeredQuestions.length) * 100);
    
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {percentage >= 70 ? (
                <Award className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Тест завершен!</h2>
            <p className="text-xl text-gray-600 mb-6">
              Ваш результат: {testSession.score} из {testSession.answeredQuestions.length} ({percentage}%)
            </p>
            
            {/* Points Display */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-gray-900">Очки получены!</span>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  +{gamificationSystem.calculatePoints('test_completion', { 
                    accuracy: percentage, 
                    isAdaptive: selectedMode === 'adaptive' 
                  }).points} очков
                </div>
                <div className="text-sm text-gray-600">
                  {selectedMode === 'adaptive' ? 'Адаптивный тест' : 'Стандартный тест'}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика теста</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{testSession.score}</div>
                  <div className="text-sm text-gray-600">Правильных ответов</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
                  <div className="text-sm text-gray-600">Точность</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{testSession.answeredQuestions.length}</div>
                  <div className="text-sm text-gray-600">Вопросов отвечено</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((Date.now() - testSession.timeStarted.getTime()) / 60000)}
                  </div>
                  <div className="text-sm text-gray-600">Минут потрачено</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={restartTest}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Пройти еще раз
              </button>
              <button
                onClick={() => setIsStarted(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Вернуться к настройкам
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isStarted && currentQuestion) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={restartTest}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться
            </button>
            
            <div className="flex items-center space-x-4">
              {selectedMode === 'timed' && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeLeft)}
                </div>
              )}
              <div className="text-sm text-gray-600">
                Вопрос {testSession.answeredQuestions.length + 1} из 10
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Прогресс</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty === 'easy' ? 'Легкий' :
                   currentQuestion.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                </span>
                {selectedMode === 'adaptive' && (
                  <span className="text-sm text-purple-600 font-medium">
                    Адаптивный режим
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h2>
            </div>

            {!showResult ? (
              <>
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ответить
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-1" />
                  )}
                  <div>
                    <h3 className={`font-semibold mb-2 ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'text-green-900'
                        : 'text-red-900'
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Правильно!' : 'Неправильно'}
                    </h3>
                    
                    {selectedAnswer !== currentQuestion.correctAnswer && (
                      <p className="text-red-800 mb-2">
                        Правильный ответ: {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                    )}
                    
                    {currentQuestion.explanation && (
                      <p className="text-gray-700 text-sm">
                        {currentQuestion.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Нейроэкзаменатор</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Оцените преимущества адаптивного тестирования на основе искусственного интеллекта, которое учится на ваших ответах и ​​оптимизирует сложность в режиме реального времени для максимальной эффективности обучения.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Exam Interface */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Mode Selection */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Выберите режим экзамена</h3>
                <div className="space-y-4">
                  {examModes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedMode === mode.id
                            ? mode.color
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            selectedMode === mode.id ? 'bg-white/50' : mode.color.split(' ')[0] + ' ' + mode.color.split(' ')[1]
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{mode.title}</h4>
                            <p className="text-sm opacity-80 mb-2">{mode.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {mode.features.map((feature) => (
                                <span
                                  key={feature}
                                  className="px-2 py-1 bg-white/50 rounded-lg text-xs font-medium"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Exam Configuration */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Конфигурация экзамена</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Предмет</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Искусственный интеллект</option>
                      <option>Математика</option>
                      <option>Информатика</option>
                      <option>ЕГЭ</option>
                      <option>Смешанные вопросы</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сложность</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Автоадаптивный</option>
                      <option>Начальный</option>
                      <option>Средний</option>
                      <option>Высокий</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Продолжительность</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>15 минут</option>
                      <option>30 минут</option>
                      <option>60 минут</option>
                      <option>Без ограничений</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Вопросы</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>10 вопросов</option>
                      <option>20 вопросов</option>
                      <option>50 вопросов</option>
                      <option>Адаптивное количество</option>
                    </select>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startExam}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 group"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Начать {examModes.find(m => m.id === selectedMode)?.title}
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Обзор результатов</h3>
              <div className="space-y-4">
                {recentScores.map((score, index) => (
                  <div key={score.subject} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{score.subject}</h4>
                      <p className="text-sm text-gray-500">{score.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{score.score}%</span>
                      <TrendingUp className={`h-4 w-4 ${
                        score.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <BarChart className="h-4 w-4 inline mr-2" />
                Просмотреть подробную аналитику
              </button>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Недавние достижения</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.title} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${achievement.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Аналитические данные об ИИ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Brain className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Адаптивное тестирование подстраивается под ваш уровень знаний в реальном времени.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Система анализирует ваши ответы и предлагает вопросы оптимальной сложности.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Получите максимально точную оценку своих знаний за минимальное время.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuroExaminer;