import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Brain, Target, TrendingUp, Calendar, ArrowRight, RotateCcw } from 'lucide-react';
import { repetitionSystem, RepetitionItem, RepetitionSession as IRepetitionSession } from '../utils/intervalRepetition';
import { gamificationSystem } from '../utils/gamification';

interface RepetitionSessionProps {
  onComplete?: (results: { accuracy: number; duration: number }) => void;
  onClose?: () => void;
}

const RepetitionSession: React.FC<RepetitionSessionProps> = ({ onComplete, onClose }) => {
  const [session, setSession] = useState<IRepetitionSession | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<{ itemId: string; isCorrect: boolean; responseTime: number }[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    const newSession = repetitionSystem.startSession();
    setSession(newSession);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (session && !sessionComplete && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !sessionComplete) {
      handleSessionComplete();
    }
  }, [timeLeft, session, sessionComplete]);

  const currentItem = session?.items[currentItemIndex];

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (!currentItem || !session) return;

    const responseTime = (Date.now() - startTime) / 1000;
    const result = {
      itemId: currentItem.id,
      isCorrect,
      responseTime
    };

    setResults(prev => [...prev, result]);
    setShowAnswer(true);

    setTimeout(() => {
      if (currentItemIndex < session.items.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
        setUserAnswer('');
        setShowAnswer(false);
        setStartTime(Date.now());
      } else {
        handleSessionComplete();
      }
    }, 2000);
  };

  const handleSessionComplete = () => {
    if (!session) return;

    // Calculate and award points for repetition session
    const accuracy = results.length > 0 ? (results.filter(r => r.isCorrect).length / results.length) * 100 : 0;
    const duration = Math.round((Date.now() - session.date.getTime()) / 60000);
    
    const { points, multiplier } = gamificationSystem.calculatePoints('repetition_session', {
      accuracy,
      duration,
      itemCount: results.length,
      streak: gamificationSystem.getUserStats().currentStreak
    });
    
    gamificationSystem.awardPoints('Repetition Session', 'repetition', points, multiplier);
    
    // Update statistics
    gamificationSystem.updateStats({
      totalSessions: gamificationSystem.getUserStats().totalSessions + 1,
      totalCorrectAnswers: gamificationSystem.getUserStats().totalCorrectAnswers + results.filter(r => r.isCorrect).length,
      totalQuestions: gamificationSystem.getUserStats().totalQuestions + results.length,
      timeSpentLearning: gamificationSystem.getUserStats().timeSpentLearning + duration
    });
    
    repetitionSystem.completeSession(session.id, results);
    setSessionComplete(true);


    onComplete?.({ accuracy, duration });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'definition': return <Brain className="h-4 w-4" />;
      case 'application': return <Target className="h-4 w-4" />;
      case 'example': return <TrendingUp className="h-4 w-4" />;
      default: return <RotateCcw className="h-4 w-4" />;
    }
  };

  if (!session) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Подготовка сессии повторения</h3>
            <p className="text-gray-600">Загружаем материалы для изучения...</p>
          </div>
        </div>
      </div>
    );
  }

  if (session.items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Отлично!</h3>
          <p className="text-gray-600 mb-6">На сегодня нет материалов для повторения. Все изученное находится в оптимальных интервалах.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Закрыть
          </button>
        </motion.div>
      </div>
    );
  }

  if (sessionComplete) {
    const accuracy = results.length > 0 ? (results.filter(r => r.isCorrect).length / results.length) * 100 : 0;
    const duration = Math.round((Date.now() - session.date.getTime()) / 60000);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4"
        >
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              accuracy >= 80 ? 'bg-green-100' : accuracy >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {accuracy >= 80 ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Target className="h-8 w-8 text-yellow-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Сессия завершена!</h3>
            <p className="text-gray-600">Ваши результаты повторения</p>
          </div>
          
          {/* Points Earned */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-gray-900">Очки получены!</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                +{gamificationSystem.calculatePoints('repetition_session', { 
                  accuracy, 
                  duration,
                  itemCount: results.length 
                }).points} очков
              </div>
              <div className="text-sm text-gray-600">За сессию повторения</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-gray-600">Точность</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{duration}</div>
              <div className="text-sm text-gray-600">Минут</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{results.length}</div>
              <div className="text-sm text-gray-600">Элементов</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Результаты по элементам:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {results.map((result, index) => {
                const item = session.items.find(i => i.id === result.itemId);
                return (
                  <div key={result.itemId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {result.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm text-gray-700 truncate">
                        {item?.content.substring(0, 50)}...
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(result.responseTime)}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Завершить
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Сессия повторения</h2>
            <p className="text-sm text-gray-600">
              Элемент {currentItemIndex + 1} из {session.items.length}
            </p>
          </div>
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

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Прогресс</span>
            <span>{Math.round(((currentItemIndex + 1) / session.items.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentItemIndex + 1) / session.items.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Item */}
        {currentItem && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                {getContextIcon(currentItem.context)}
                <span className="capitalize">{currentItem.context}</span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs ${
                currentItem.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                currentItem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {currentItem.difficulty === 'hard' ? 'Сложный' :
                 currentItem.difficulty === 'medium' ? 'Средний' : 'Легкий'}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                {currentItem.category}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentItem.content}
              </h3>

              {!showAnswer ? (
                <div className="space-y-4">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Введите ваш ответ..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAnswerSubmit(true)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Знаю ответ
                    </button>
                    <button
                      onClick={() => handleAnswerSubmit(false)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Не помню
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-lg ${
                    results[results.length - 1]?.isCorrect 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {results[results.length - 1]?.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        results[results.length - 1]?.isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {results[results.length - 1]?.isCorrect ? 'Правильно!' : 'Нужно повторить'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Следующее повторение этого материала будет запланировано автоматически.
                    </p>
                  </div>

                  {currentItemIndex < session.items.length - 1 && (
                    <div className="flex items-center justify-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <span>Переход к следующему элементу</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RepetitionSession;