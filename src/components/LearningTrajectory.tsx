import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, CheckCircle, Clock, TrendingUp, ArrowRight, Play, Award, Brain } from 'lucide-react';
import { educationalTrajectoryService, LearningPath, TrajectoryStep } from '../utils/educationalTrajectory';
import { authService } from '../utils/auth';

interface LearningTrajectoryProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

const LearningTrajectory: React.FC<LearningTrajectoryProps> = ({ isOpen, onClose, onNavigate }) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [nextStep, setNextStep] = useState<TrajectoryStep | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const user = authService.getCurrentUser();
      if (user) {
        const path = educationalTrajectoryService.getUserPath(user.id);
        const next = educationalTrajectoryService.getNextStep(user.id);
        const statistics = educationalTrajectoryService.getLearningStats(user.id);
        
        setLearningPath(path);
        setNextStep(next);
        setStats(statistics);
      }
    }
  }, [isOpen]);

  const handleCompleteStep = (stepId: string) => {
    const user = authService.getCurrentUser();
    if (user) {
      educationalTrajectoryService.completeStep(user.id, stepId, 85); // Mock score
      
      // Refresh data
      const path = educationalTrajectoryService.getUserPath(user.id);
      const next = educationalTrajectoryService.getNextStep(user.id);
      const statistics = educationalTrajectoryService.getLearningStats(user.id);
      
      setLearningPath(path);
      setNextStep(next);
      setStats(statistics);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'theory': return <BookOpen className="h-5 w-5" />;
      case 'practice': return <Target className="h-5 w-5" />;
      case 'test': return <Brain className="h-5 w-5" />;
      case 'project': return <Award className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-600';
      case 'practice': return 'bg-green-100 text-green-600';
      case 'test': return 'bg-purple-100 text-purple-600';
      case 'project': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Образовательная траектория</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {!learningPath ? (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Траектория не создана</h3>
            <p className="text-gray-600 mb-6">
              Пройдите тест, чтобы создать персонализированную образовательную траекторию
            </p>
            <button
              onClick={() => {
                onNavigate?.('neuro-examiner');
                onClose();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Пройти тест
            </button>
          </div>
        ) : (
          <>
            {/* Path Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{learningPath.title}</h3>
              <p className="text-gray-700 mb-4">{learningPath.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(learningPath.progress)}%</div>
                  <div className="text-sm text-gray-600">Прогресс</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{learningPath.steps.filter(s => s.isCompleted).length}</div>
                  <div className="text-sm text-gray-600">Завершено</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{learningPath.estimatedCompletionTime}ч</div>
                  <div className="text-sm text-gray-600">Осталось</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{learningPath.goals.length}</div>
                  <div className="text-sm text-gray-600">Целей</div>
                </div>
              </div>

              <div className="w-full bg-white rounded-full h-3 mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${learningPath.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Next Step */}
            {nextStep && (
              <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Play className="h-5 w-5 mr-2 text-blue-600" />
                    Следующий шаг
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStepColor(nextStep.type)}`}>
                      {nextStep.type === 'theory' ? 'Теория' :
                       nextStep.type === 'practice' ? 'Практика' :
                       nextStep.type === 'test' ? 'Тест' : 'Проект'}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(nextStep.difficulty)}`}>
                      {nextStep.difficulty === 'easy' ? 'Легко' :
                       nextStep.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                    </span>
                  </div>
                </div>
                
                <h5 className="font-semibold text-gray-900 mb-2">{nextStep.title}</h5>
                <p className="text-gray-600 mb-4">{nextStep.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {nextStep.estimatedTime} минут
                  </div>
                  <button
                    onClick={() => handleCompleteStep(nextStep.id)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Начать
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Learning Goals */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Цели обучения</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {learningPath.goals.map(goal => {
                  const goalSteps = learningPath.steps.filter(s => s.goalId === goal.id);
                  const completedGoalSteps = goalSteps.filter(s => s.isCompleted);
                  const goalProgress = goalSteps.length > 0 ? (completedGoalSteps.length / goalSteps.length) * 100 : 0;

                  return (
                    <div key={goal.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{goal.title}</h5>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          goal.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          goal.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {goal.difficulty === 'beginner' ? 'Начальный' :
                           goal.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {completedGoalSteps.length} из {goalSteps.length} шагов
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round(goalProgress)}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Steps */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Все шаги</h4>
              <div className="space-y-3 overflow-y-auto">
                {learningPath.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                        step.isCompleted 
                          ? 'border-green-200 bg-green-50' 
                          : step.id === nextStep?.id
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          step.isCompleted ? 'bg-green-100 text-green-600' : getStepColor(step.type)
                        }`}>
                          {step.isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            getStepIcon(step.type)
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{step.title}</h5>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{step.estimatedTime} мин</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(step.difficulty)}`}>
                              {step.difficulty === 'easy' ? 'Легко' :
                               step.difficulty === 'medium' ? 'Средне' : 'Сложно'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {step.isCompleted && step.score && (
                          <span className="text-sm font-medium text-green-600">
                            {step.score}%
                          </span>
                        )}
                        {step.id === nextStep?.id && (
                          <button
                            onClick={() => handleCompleteStep(step.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Начать
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Adaptations */}
            {learningPath.adaptations.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">История адаптаций</h4>
                <div className="space-y-2">
                  {learningPath.adaptations.slice(-3).map(adaptation => (
                    <div key={adaptation.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-yellow-900">{adaptation.reason}</span>
                        <span className="text-xs text-yellow-600">
                          {adaptation.date.toLocaleDateString()}
                        </span>
                      </div>
                      <ul className="text-sm text-yellow-800">
                        {adaptation.changes.map((change, idx) => (
                          <li key={idx}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default LearningTrajectory;